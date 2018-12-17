import * as cantonConfigs from './cantonConfigs';
import Calculator from '../Calculator';
import { NOTARY_FEES } from '../../config/financeConstants';
import { PURCHASE_TYPE } from '../../api/constants';

const roundToCents = val => Number(val.toFixed(2));

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
      return { total: this.getDefaultFees({ loan }), canton: this.canton };
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

    return {
      total: roundToCents(buyersContractFees + mortgageNoteFees - deductions),
      buyersContractFees: roundToCents(buyersContractFees),
      mortgageNoteFees: roundToCents(mortgageNoteFees),
      deductions: roundToCents(deductions),
      canton: this.canton,
    };
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

    return buyersContractDeductions + mortgageNoteDeductions;
  }

  getDefaultFees({ loan }) {
    const propertyValue = Calculator.selectPropertyValue({ loan });

    return propertyValue * NOTARY_FEES;
  }
}

export default NotaryFeesCalculator;
