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

  shouldUseConstructionMath({ loan, structureId }) {
    const hasDetailedValue = Calculator.hasDetailedPropertyValue({
      loan,
      structureId,
    });
    const shouldUseConstructionNotaryFees = Calculator.shouldUseConstructionNotaryFees({ loan, structureId });

    return hasDetailedValue && shouldUseConstructionNotaryFees;
  }

  getNotaryFeesForLoan({ loan, structureId }) {
    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

    if (!this.hasDetailedConfig()) {
      return this.getDefaultFees({ propertyValue });
    }

    const { residenceType } = loan;

    const mortgageNoteIncrease = Calculator.getMortgageNoteIncrease({
      loan,
      structureId,
    });

    // Acte d'achat
    const buyersContractFees = this.buyersContractFees({ loan, structureId });

    // Cédule hypothécaire
    const mortgageNoteFees = this.mortgageNoteFees({ mortgageNoteIncrease });

    // Déductions
    const deductions = this.getDeductions({
      propertyValue,
      mortgageNoteFees,
      residenceType,
      mortgageNoteIncrease,
      propertyTransferTax:
        buyersContractFees.propertyRegistrationTax
        + (buyersContractFees.propertyConstructionTax || 0),
    });

    const roundedResult = roundObjectKeys({
      total:
        buyersContractFees.total + mortgageNoteFees.total - deductions.total,
      buyersContractFees: roundObjectKeys(buyersContractFees),
      mortgageNoteFees: roundObjectKeys(mortgageNoteFees),
      deductions: roundObjectKeys(deductions),
      canton: this.canton,
      estimate: false,
    });

    return roundedResult;
  }

  getNotaryFeesWithoutLoan({
    propertyValue,
    mortgageNoteIncrease,
    residenceType,
  }) {
    if (!this.hasDetailedConfig()) {
      return this.getDefaultFees({ propertyValue });
    }

    // Acte d'achat
    const buyersContractFees = this.buyersContractFeesAcquisition({
      propertyValue,
    });

    // Cédule hypothécaire
    const mortgageNoteFees = this.mortgageNoteFees({ mortgageNoteIncrease });

    // Déductions
    const deductions = this.getDeductions({
      propertyValue,
      mortgageNoteIncrease,
      residenceType,
      propertyTransferTax: this.propertyRegistrationTax({ propertyValue }),
    });

    const roundedResult = roundObjectKeys({
      total:
        buyersContractFees.total + mortgageNoteFees.total - deductions.total,
      buyersContractFees: roundObjectKeys(buyersContractFees),
      mortgageNoteFees: roundObjectKeys(mortgageNoteFees),
      deductions: roundObjectKeys(deductions),
      canton: this.canton,
      estimate: false,
    });

    return roundedResult;
  }

  buyersContractFees({ loan, structureId }) {
    if (loan.purchaseType === PURCHASE_TYPE.REFINANCING) {
      return { total: 0 };
    }

    if (this.shouldUseConstructionMath({ loan, structureId })) {
      const {
        landValue,
        constructionValue,
        additionalMargin,
      } = Calculator.selectProperty({ loan, structureId });
      return this.buyersContractFeesConstruction({
        landValue,
        constructionValue,
        additionalMargin,
      });
    }

    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });
    return this.buyersContractFeesAcquisition({ propertyValue });
  }

  buyersContractFeesAcquisition({ propertyValue }) {
    // Frais d'enregistrement/Droits de mutation
    const propertyRegistrationTax = this.propertyRegistrationTax({
      propertyValue,
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

  buyersContractFeesConstruction({
    landValue,
    constructionValue,
    additionalMargin,
  }) {
    // Frais d'enregistrement/Droits de mutation
    const propertyRegistrationTax = this.propertyRegistrationTax({
      propertyValue: landValue + additionalMargin,
    });

    // Emoluments du notaire
    const notaryIncomeFromProperty = this.notaryIncomeFromProperty({
      propertyValue: landValue + additionalMargin,
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

  mortgageNoteFees({ mortgageNoteIncrease }) {
    // Frais d'enregistrement
    const mortgageNoteRegistrationTax = this.mortgageNoteRegistrationTax({
      mortgageNoteIncrease,
    });
    // Emoluments du notaire
    const notaryIncomeFromMortgageNote = this.notaryIncomeFromMortgageNote({
      mortgageNoteIncrease,
    });
    // Registre foncier
    const landRegistryMortgageNoteTax = this.landRegistryMortgageNoteTax({
      mortgageNoteIncrease,
    });
    // Frais du notaire additionnels estimés
    // Nuls si aucune cédule nécessaire
    const additionalFees = mortgageNoteIncrease > 0 ? this.additionalFees() : 0;

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

  getDeductions({
    propertyValue,
    mortgageNoteIncrease,
    residenceType,
    propertyTransferTax,
  }) {
    const buyersContractDeductions = this.buyersContractDeductions
      ? this.buyersContractDeductions({
        residenceType,
        propertyValue,
        transferTax: propertyTransferTax,
      })
      : 0;

    const mortgageNoteDeductions = this.mortgageNoteDeductions
      ? this.mortgageNoteDeductions({
        residenceType,
        propertyValue,
        mortgageNoteRegistrationTax: this.mortgageNoteRegistrationTax({
          mortgageNoteIncrease,
        }),
      })
      : 0;

    return {
      buyersContractDeductions,
      mortgageNoteDeductions,
      total: buyersContractDeductions + mortgageNoteDeductions,
    };
  }

  getDefaultFees({ propertyValue }) {
    return {
      total: propertyValue * NOTARY_FEES,
      canton: this.canton,
      estimate: true,
    };
  }
}

export default NotaryFeesCalculator;
