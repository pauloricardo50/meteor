import degressive from './degressive';
import cantons from './cantonConstants';

export const GE = {
  notaryIncomeFromProperty: ({ value }) =>
    degressive({
      amount: value,
      brackets: cantons.GE.NOTARY_PROPERTY_BRACKETS,
    }),
  notaryIncomeFromMortgageDeed: ({ deedValue, deedIncrease }) =>
    degressive({
      amount: deedIncrease || deedValue,
      brackets: cantons.GE.NOTARY_DEED_BRACKETS,
    }),
  propertyTransferTax: ({ value }) => value * cantons.GE.TRANSFER_TAX,
};
