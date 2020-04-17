import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import { VAT } from '../../config/financeConstants';
import * as cantons from './cantonConstants';
import degressive from './degressive';

const isCasatax = ({ residenceType, propertyValue }) =>
  residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE &&
  propertyValue <= cantons.GE.CASATAX_CUTOFF;

export const GE = {
  notaryIncomeFromProperty: ({ propertyValue }) =>
    degressive({
      amount: propertyValue,
      brackets: cantons.GE.NOTARY_PROPERTY_BRACKETS,
      minTax: cantons.GE.NOTARY_PROPERTY_BRACKETS_MIN,
    }) *
    (1 + VAT),
  notaryIncomeFromMortgageNote: ({ mortgageNoteIncrease }) =>
    degressive({
      amount: mortgageNoteIncrease,
      brackets: cantons.GE.NOTARY_NOTE_BRACKETS,
    }) *
    (1 + VAT),
  propertyConstructionTax: ({ constructionValue }) =>
    constructionValue * cantons.GE.PROPERTY_CONSTRUCTION_TAX,
  propertyRegistrationTax: ({ propertyValue }) =>
    propertyValue * cantons.GE.PROPERTY_REGISTRATION_TAX,
  landRegistryPropertyTax: ({ propertyValue }) =>
    propertyValue * cantons.GE.LAND_REGISTRY_PROPERTY_TAX,
  mortgageNoteRegistrationTax: ({ mortgageNoteIncrease }) =>
    mortgageNoteIncrease * cantons.GE.MORTGAGE_NOTE_REGISTRATION_TAX,
  landRegistryMortgageNoteTax: ({ mortgageNoteIncrease }) =>
    mortgageNoteIncrease * cantons.GE.LAND_REGISTRY_MORTGAGE_NOTE_TAX,
  buyersContractDeductions: ({
    residenceType,
    propertyValue,
    transferTax = 0,
  }) =>
    isCasatax({ residenceType, propertyValue })
      ? Math.min(cantons.GE.CASATAX_PROPERTY_DEDUCTION, transferTax)
      : 0,
  additionalFees: () => cantons.GE.ADDITIONAL_FEES,
  mortgageNoteDeductions: ({
    residenceType,
    propertyValue,
    mortgageNoteRegistrationTax,
  }) =>
    isCasatax({ residenceType, propertyValue })
      ? mortgageNoteRegistrationTax * cantons.GE.MORTGAGE_NOTE_CASATAX_DEDUCTION
      : 0,
};

export const VD = {
  notaryIncomeFromProperty: ({ propertyValue }) =>
    degressive({
      amount: propertyValue,
      brackets: cantons.VD.NOTARY_PROPERTY_BRACKETS,
      minTax: cantons.VD.NOTARY_PROPERTY_BRACKETS_MIN,
    }) *
    (1 + VAT),
  propertyConstructionTax: () => 0, // TODO
  notaryIncomeFromMortgageNote: ({ mortgageNoteIncrease }) =>
    degressive({
      amount: mortgageNoteIncrease,
      brackets: cantons.VD.NOTARY_NOTE_BRACKETS,
    }) *
    (1 + VAT),
  propertyRegistrationTax: ({ propertyValue }) =>
    propertyValue * cantons.VD.PROPERTY_REGISTRATION_TAX,
  landRegistryPropertyTax: ({ propertyValue }) =>
    propertyValue * cantons.VD.LAND_REGISTRY_PROPERTY_TAX,
  mortgageNoteRegistrationTax: ({ mortgageNoteIncrease }) => 0,
  landRegistryMortgageNoteTax: ({ mortgageNoteIncrease }) =>
    mortgageNoteIncrease * cantons.VD.LAND_REGISTRY_MORTGAGE_NOTE_TAX,
  additionalFees: () => cantons.VD.ADDITIONAL_FEES,
};
