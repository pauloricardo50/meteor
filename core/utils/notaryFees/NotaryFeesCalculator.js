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

  getNotaryFeesForLoan({ loan, structureId }) {
    if (!cantonConfigs[this.canton]) {
      return {
        total: this.getDefaultFees({ loan, structureId }),
        canton: this.canton,
      };
    }

    // Acte d'achat
    const buyersContractFees = this.buyersContractFees({ loan, structureId });
    // Cédule hypothécaire
    const mortgageNoteFees = this.mortgageNoteFees({ loan, structureId });
    // Déductions
    const deductions = this.getDeductions({
      buyersContractFees,
      mortgageNoteFees,
      loan,
      structureId,
    });

    const roundedResult = roundObjectKeys({
      total: buyersContractFees + mortgageNoteFees - deductions.total,
      buyersContractFees,
      mortgageNoteFees,
      deductions: roundObjectKeys(deductions),
      canton: this.canton,
    });

    return roundedResult;
  }

  buyersContractFees({ loan, structureId }) {
    if (loan.purchaseType === PURCHASE_TYPE.REFINANCING) {
      return 0;
    }

    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

    // Frais d'enregistrement/Droits de mutation
    const propertyRegistrationTax = this.propertyRegistrationTax({
      value: propertyValue,
      loan,
    });
    // Emoluments du notaire
    const notaryIncomeFromProperty = this.notaryIncomeFromProperty({
      value: propertyValue,
    });
    // Registre foncier
    const landRegistryPropertyTax = this.landRegistryPropertyTax({
      value: propertyValue,
    });
    // Frais du notaire additionnels estimés
    const additionalFees = this.additionalFees();

    return (
      propertyRegistrationTax
      + notaryIncomeFromProperty
      + landRegistryPropertyTax
      + additionalFees
    );
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

    return (
      mortgageNoteRegistrationTax
      + landRegistryMortgageNoteTax
      + notaryIncomeFromMortgageNote
      + additionalFees
    );
  }

  getDeductions({ loan, structureId }) {
    const propertyValue = Calculator.selectPropertyValue({ loan, structureId });

    const buyersContractDeductions = this.buyersContractDeductions
      ? this.buyersContractDeductions({
        loan,
        transferTax: this.propertyRegistrationTax({
          value: propertyValue,
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
