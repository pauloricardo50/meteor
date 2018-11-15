// @flow
import { INTEREST_RATES } from '../../constants';

export const borrowerIdsSchema = {
  borrowerIds: { type: Array, defaultValue: [] },
  'borrowerIds.$': String,
};

export const loanTranchesSchema = (withDefaultValue = true) => ({
  loanTranches: {
    type: Array,
    defaultValue: withDefaultValue
      ? [{ type: INTEREST_RATES.YEARS_10, value: 1 }]
      : [],
  },
  'loanTranches.$': Object,
  'loanTranches.$.type': {
    type: String,
    optional: true,
    allowedValues: Object.values(INTEREST_RATES),
  },
  'loanTranches.$.value': {
    type: Number,
    optional: true,
    min: 0,
    max: 1,
  },
  'loanTranches.$.dueDate': {
    type: String,
    optional: true,
  },
});

// Same as loanTranchesSchema, but prefixed with "previousLoanTranches"
export const previousLoanTranchesSchema = Object.keys(loanTranchesSchema(false)).reduce(
  (obj, key) => ({
    ...obj,
    [key.replace('loanTranches', 'previousLoanTranches')]: loanTranchesSchema(false)[key],
  }),
  {},
);

export type loanTranchesType = Array<{
  type: string,
  value: number,
}>;

export const propertyIdsSchema = {
  propertyIds: { type: Array, defaultValue: [] },
  'propertyIds.$': String,
};

export const mortgageNotesSchema = {
  mortgageNotes: { type: Array, defaultValue: [] },
  'mortgageNotes.$': Object,
  'mortgageNotes.$.value': { type: Number, min: 0, max: 1000000000 },
};
