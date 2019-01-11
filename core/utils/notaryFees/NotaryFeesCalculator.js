import * as cantonConfigs from './cantonConfigs';
import Calculator from '../Calculator';
import { NOTARY_FEES } from '../../config/financeConstants';
import { PURCHASE_TYPE } from '../../api/constants';

const roundToCents = val => Number(val.toFixed(2));

const roundObjectKeys = obj =>
  Object.keys(obj).reduce(
    (newObj, key) => ({
      ...newObj,
      [key]: typeof obj[key] === 'number' ? roundToCents(obj[key]) : obj[key],
    }),
    {},
  );

class NotaryFeesCalculator {
  constructor({ canton }) {
    this.init(canton);
  }

  init(canton) {
    const config = cantonConfigs[canton];
    this.canton = canton;

    Object.assign(this, config);
  }

  hasDetailedConfig() {
    return cantonConfigs[this.canton];
  }

  getNotaryFeesForLoan({ loan, structureId }) {
    if (!this.hasDetailedConfig()) {
      return {
        total: this.getDefaultFees({ loan, structureId }),
        canton: this.canton,
        estimate: true,
      };
    }

    // Acte d'achat
    const buyersContractFees = this.buyersContractFees({ loan, structureId });
    // Cédule hypothécaire
    const mortgageNoteFees = this.mortgageNoteFees({ loan, structureId });
    // Déductions
    const deductions = this.getDeductions({
      loan,
      structureId,
    });

    const roundedResult = roundObjectKeys({
      total:
        buyersContractFees.total + mortgageNoteFees.total - deductions.total,
      buyersContractFees: roundObjectKeys(buyersContractFees),
      mortgageNoteFees: roundObjectKeys(mortgageNoteFees),
      deductions: roundObjectKeys(deductions),
      canton: this.canton,
    });

    return roundedResult;
  }

  buyersContractFees({ loan, structureId }) {
    if (loan.purchaseType === PURCHASE_TYPE.REFINANCING) {
      return { total: 0 };
    }

    const hasDetailedValue = Calculator.hasDetailedPropertyValue({
      loan,
      structureId,
    });

    if (hasDetailedValue) {
      return this.buyersContractFeesConstruction({ loan, structureId });
    }

    return this.buyersContractFeesAcquisition({ loan, structureId });
  }

  buyersContractFeesAcquisition({ loan, structureId }) {
    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

    // Frais d'enregistrement/Droits de mutation
    const propertyRegistrationTax = this.propertyRegistrationTax({
      propertyValue,
      loan,
    });
    // Emoluments du notaire
    const notaryIncomeFromProperty = this.notaryIncomeFromProperty({
      propertyValue,
    });
    // Registre foncier
    const landRegistryPropertyTax = this.landRegistryPropertyTax({
      propertyValue,
    });
    // Frais du notaire additionnels estimés
    const additionalFees = this.additionalFees();

    return {
      total:
        propertyRegistrationTax
        + notaryIncomeFromProperty
        + landRegistryPropertyTax
        + additionalFees,
      propertyRegistrationTax,
      notaryIncomeFromProperty,
      landRegistryPropertyTax,
      additionalFees,
    };
  }

  buyersContractFeesConstruction({ loan, structureId }) {
    const {
      landValue,
      constructionValue,
      additionalMargin,
    } = Calculator.selectProperty({ loan, structureId });

    // Frais d'enregistrement/Droits de mutation
    const propertyRegistrationTax = this.propertyRegistrationTax({
      propertyValue: landValue + additionalMargin,
      loan,
    });

    // Emoluments du notaire
    const notaryIncomeFromProperty = this.notaryIncomeFromProperty({
      propertyValue: landValue + additionalMargin + constructionValue,
    });

    // Registre foncier
    const landRegistryPropertyTax = this.landRegistryPropertyTax({
      propertyValue: landValue + additionalMargin,
    });

    // Contrat de construction
    const propertyConstructionTax = this.propertyConstructionTax({
      constructionValue,
    });

    // Frais du notaire additionnels estimés
    const additionalFees = this.additionalFees();

    return {
      total:
        propertyRegistrationTax
        + notaryIncomeFromProperty
        + landRegistryPropertyTax
        + propertyConstructionTax
        + additionalFees,
      propertyRegistrationTax,
      notaryIncomeFromProperty,
      landRegistryPropertyTax,
      propertyConstructionTax,
      additionalFees,
    };
  }

  mortgageNoteFees({ loan, structureId }) {
    const noteIncrease = Calculator.getMortgageNoteIncrease({
      loan,
      structureId,
    });

    // Frais d'enregistrement
    const mortgageNoteRegistrationTax = this.mortgageNoteRegistrationTax({
      noteIncrease,
      loan,
    });
    // Emoluments du notaire
    const notaryIncomeFromMortgageNote = this.notaryIncomeFromMortgageNote({
      noteIncrease,
    });
    // Registre foncier
    const landRegistryMortgageNoteTax = this.landRegistryMortgageNoteTax({
      noteIncrease,
    });
    // Frais du notaire additionnels estimés
    // Nuls si aucune cédule nécessaire
    const additionalFees = noteIncrease > 0 ? this.additionalFees() : 0;

    return {
      total:
        mortgageNoteRegistrationTax
        + landRegistryMortgageNoteTax
        + notaryIncomeFromMortgageNote
        + additionalFees,
      mortgageNoteRegistrationTax,
      landRegistryMortgageNoteTax,
      notaryIncomeFromMortgageNote,
      additionalFees,
    };
  }

  getDeductions({ loan, structureId }) {
    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

    const buyersContractDeductions = this.buyersContractDeductions
      ? this.buyersContractDeductions({
        loan,
        transferTax: this.propertyRegistrationTax({
          propertyValue,
          loan,
        }),
      })
      : 0;
    const mortgageNoteDeductions = this.mortgageNoteDeductions
      ? this.mortgageNoteDeductions({
        loan,
        mortgageNoteRegistrationTax: this.mortgageNoteRegistrationTax({
          noteIncrease: Calculator.getMortgageNoteIncrease({
            loan,
            structureId,
          }),
          loan,
        }),
      })
      : 0;

    return {
      buyersContractDeductions,
      mortgageNoteDeductions,
      total: buyersContractDeductions + mortgageNoteDeductions,
    };
  }

  getDefaultFees({ loan, structureId }) {
    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

    return propertyValue * NOTARY_FEES;
  }
}

export default NotaryFeesCalculator;
