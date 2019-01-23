import { RESIDENCE_TYPE } from 'core/api/constants';
import degressive from './degressive';
import * as cantons from './cantonConstants';
import { VAT } from '../../config/financeConstants';
import Calculator from '../Calculator';

const isCasatax = loan =>
  loan.residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
  && Calculator.selectPropertyValue({ loan }) <= cantons.GE.CASATAX_CUTOFF;

export const GE = {
  notaryIncomeFromProperty: ({ propertyValue }) =>
    degressive({
      amount: propertyValue,
      brackets: cantons.GE.NOTARY_PROPERTY_BRACKETS,
      minTax: cantons.GE.NOTARY_PROPERTY_BRACKETS_MIN,
    })
    * (1 + VAT),
  notaryIncomeFromMortgageNote: ({ noteIncrease }) =>
    degressive({
      amount: noteIncrease,
      brackets: cantons.GE.NOTARY_NOTE_BRACKETS,
    })
    * (1 + VAT),
  propertyConstructionTax: ({ constructionValue }) =>
    constructionValue * cantons.GE.PROPERTY_CONSTRUCTION_TAX,
  propertyRegistrationTax: ({ propertyValue }) =>
    propertyValue * cantons.GE.PROPERTY_REGISTRATION_TAX,
  landRegistryPropertyTax: ({ propertyValue }) =>
    propertyValue * cantons.GE.LAND_REGISTRY_PROPERTY_TAX,
  mortgageNoteRegistrationTax: ({ noteIncrease }) =>
    noteIncrease * cantons.GE.MORTGAGE_NOTE_REGISTRATION_TAX,
  landRegistryMortgageNoteTax: ({ noteIncrease }) =>
    noteIncrease * cantons.GE.LAND_REGISTRY_MORTGAGE_NOTE_TAX,
  additionalFees: () => cantons.GE.ADDITIONAL_FEES * (1 + VAT),
  buyersContractDeductions: ({ loan, transferTax }) =>
    (isCasatax(loan)
      ? Math.min(cantons.GE.CASATAX_PROPERTY_DEDUCTION, transferTax)
      : 0),
  mortgageNoteDeductions: ({ loan, mortgageNoteRegistrationTax }) =>
    (isCasatax(loan) ? mortgageNoteRegistrationTax * 0.5 : 0),
};

export const VD = {
  notaryIncomeFromProperty: ({ propertyValue }) =>
    degressive({
      amount: propertyValue,
      brackets: cantons.VD.NOTARY_PROPERTY_BRACKETS,
      minTax: cantons.VD.NOTARY_PROPERTY_BRACKETS_MIN,
    })
    * (1 + VAT),
  propertyConstructionTax: () => 0, // TODO
  notaryIncomeFromMortgageNote: ({ noteIncrease }) =>
    degressive({
      amount: noteIncrease,
      brackets: cantons.VD.NOTARY_NOTE_BRACKETS,
    })
    * (1 + VAT),
  propertyRegistrationTax: ({ propertyValue }) =>
    propertyValue * cantons.VD.PROPERTY_REGISTRATION_TAX,
  landRegistryPropertyTax: ({ propertyValue }) =>
    propertyValue * cantons.VD.LAND_REGISTRY_PROPERTY_TAX,
  mortgageNoteRegistrationTax: ({ noteIncrease }) => 0,
  landRegistryMortgageNoteTax: ({ noteIncrease }) =>
    noteIncrease * cantons.VD.LAND_REGISTRY_MORTGAGE_NOTE_TAX,
  additionalFees: () => cantons.VD.ADDITIONAL_FEES * (1 + VAT),
};
