import * as cantonConfigs from './cantonConfigs';
import Calculator from '../Calculator';
import { NOTARY_FEES } from '../../config/financeConstants';

class NotaryFeesCalculator {
  constructor({ canton }) {
    this.init(canton);
  }

  init(canton) {
    const config = cantonConfigs[canton];
    this.canton = canton;
    Object.assign(this, config);
  }

  getNotaryFeesForLoan(loan) {
    if (!cantonConfigs[this.canton]) {
      return this.getDefaultFees({ loan });
    }

    const buyersContractFees = this.buyersContractFees(loan);
    const mortgageNoteFees = this.mortgageNoteFees(loan);
    const deductions = this.getDeductions({
      buyersContractFees,
      mortgageNoteFees,
      loan,
    });

    return Number((buyersContractFees + mortgageNoteFees - deductions).toFixed(2));
  }

  getMortgageNoteIncrease({ loan }) {
    const loanValue = Calculator.selectLoanValue({ loan });
    const currentMortgageNoteValue = 0; // TODO: Calculate this

    return Math.max(0, loanValue - currentMortgageNoteValue);
  }

  buyersContractFees(loan) {
    const propertyValue = Calculator.selectPropertyValue({ loan });
    const propertyTransferTax = this.propertyTransferTax({
      value: propertyValue,
      loan,
    });
    const notaryIncomeFromProperty = this.notaryIncomeFromProperty({
      value: propertyValue,
    });
    const landRegistryPropertyTax = this.landRegistryPropertyTax({
      value: propertyValue,
    });
    const additionalFees = this.additionalFees();

    return (
      propertyTransferTax
      + notaryIncomeFromProperty
      + landRegistryPropertyTax
      + additionalFees
    );
  }

  mortgageNoteFees(loan) {
    const noteIncrease = this.getMortgageNoteIncrease({ loan });

    const mortgageNoteRegistrationTax = this.mortgageNoteRegistrationTax({
      noteIncrease,
      loan,
    });
    const notaryIncomeFromMortgageNote = this.notaryIncomeFromMortgageNote({
      noteIncrease,
    });
    const landRegistryMortgageNoteTax = this.landRegistryMortgageNoteTax({
      noteIncrease,
    });
    const additionalFees = this.additionalFees();

    return (
      mortgageNoteRegistrationTax
      + landRegistryMortgageNoteTax
      + notaryIncomeFromMortgageNote
      + additionalFees
    );
  }

  getDeductions({ loan }) {
    const propertyValue = Calculator.selectPropertyValue({ loan });

    const buyersContractDeductions = this.buyersContractDeductions
      ? this.buyersContractDeductions({
        loan,
        transferTax: this.propertyTransferTax({
          value: propertyValue,
          loan,
        }),
      })
      : 0;
    const mortgageNoteDeductions = this.mortgageNoteDeductions
      ? this.mortgageNoteDeductions({
        loan,
        mortgageNoteRegistrationTax: this.mortgageNoteRegistrationTax({
          noteIncrease: this.getMortgageNoteIncrease({ loan }),
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
