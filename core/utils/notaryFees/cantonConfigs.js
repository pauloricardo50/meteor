import { RESIDENCE_TYPE } from 'core/api/constants';
import degressive from './degressive';
import * as cantons from './cantonConstants';
import { VAT } from '../../config/financeConstants';
import Calculator from '../Calculator';

const isCasatax = loan =>
  loan.residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
  && Calculator.selectPropertyValue({ loan }) <= cantons.GE.CASATAX_CUTOFF;

export const GE = {
  notaryIncomeFromProperty: ({ value }) =>
    degressive({
      amount: value,
      brackets: cantons.GE.NOTARY_PROPERTY_BRACKETS,
      minTax: cantons.GE.NOTARY_PROPERTY_BRACKETS_MIN,
    })
    * (1 + VAT),
  notaryIncomeFromMortgageNote: ({ noteValue, noteIncrease }) =>
    degressive({
      amount: noteValue || noteIncrease,
      brackets: cantons.GE.NOTARY_NOTE_BRACKETS,
    })
    * (1 + VAT),
  propertyTransferTax: ({ value }) => value * cantons.GE.TRANSFER_TAX,
  landRegistryPropertyTax: ({ value }) =>
    value * cantons.GE.LAND_REGISTRY_PROPERTY_TAX,
  mortgageNoteRegistrationTax: ({ noteValue, noteIncrease }) =>
    (noteValue || noteIncrease) * cantons.GE.MORTGAGE_NOTE_REGISTRATION_TAX,
  landRegistryMortgageNoteTax: ({ noteValue, noteIncrease }) =>
    (noteValue || noteIncrease) * cantons.GE.LAND_REGISTRY_MORTGAGE_NOTE_TAX,
  additionalFees: () => cantons.GE.ADDITIONAL_FEES * (1 + VAT),
  buyersContractDeductions: ({ loan, transferTax }) =>
    (isCasatax(loan)
      ? Math.min(cantons.GE.CASATAX_PROPERTY_DEDUCTION, transferTax)
      : 0),
  mortgageNoteDeductions: ({ loan, mortgageNoteRegistrationTax }) =>
    (isCasatax(loan) ? mortgageNoteRegistrationTax * 0.5 : 0),
};

export const VD = {
  notaryIncomeFromProperty: ({ value }) =>
    degressive({
      amount: value,
      brackets: cantons.VD.NOTARY_PROPERTY_BRACKETS,
      minTax: cantons.VD.NOTARY_PROPERTY_BRACKETS_MIN,
    })
    * (1 + VAT),
  notaryIncomeFromMortgageNote: ({ noteValue, noteIncrease }) =>
    degressive({
      amount: noteValue || noteIncrease,
      brackets: cantons.VD.NOTARY_NOTE_BRACKETS,
    })
    * (1 + VAT),
  propertyTransferTax: ({ value }) => value * cantons.VD.TRANSFER_TAX,
  landRegistryPropertyTax: ({ value }) =>
    value * cantons.VD.LAND_REGISTRY_PROPERTY_TAX,
  mortgageNoteRegistrationTax: ({ noteValue, noteIncrease }) =>
    (noteValue || noteIncrease) * cantons.VD.MORTGAGE_NOTE_REGISTRATION_TAX,
  landRegistryMortgageNoteTax: ({ noteValue, noteIncrease }) =>
    (noteValue || noteIncrease) * cantons.VD.LAND_REGISTRY_MORTGAGE_NOTE_TAX,
  additionalFees: () => cantons.VD.ADDITIONAL_FEES * (1 + VAT),
};
