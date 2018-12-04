// @flow
import {
  INTEREST_RATES,
  MORTGAGE_NOTE_TYPES,
  MORTGAGE_NOTE_CATEGORIES,
} from '../../constants';

export const borrowerIdsSchema = {
  borrowerIds: { type: Array, defaultValue: [] },
  'borrowerIds.$': String,
};

export const loanTranchesSchema = ({
  withDefaultValue = true,
  withRate,
} = {}) => ({
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
    max: 1000000000, // Can be specified as percentages or monetary amounts
  },
  'loanTranches.$.dueDate': {
    type: String,
    optional: true,
  },
  ...(withRate
    ? {
      'loanTranches.$.rate': {
        type: Number,
        min: 0,
        max: 1,
      },
    }
    : {}),
});

// Same as loanTranchesSchema, but prefixed with "previousLoanTranches"
const previousTranches = loanTranchesSchema({
  withDefaultValue: false,
  withRate: true,
});
export const previousLoanTranchesSchema = Object.keys(previousTranches).reduce(
  (obj, key) => ({
    ...obj,
    [key.replace('loanTranches', 'previousLoanTranches')]: previousTranches[
      key
    ],
  }),
  {},
);

export type loanTranchesType = Array<{
  type: string,
  value: number,
}>;

export const propertyIdsSchema = {
  propertyIds: { type: Array, defaultValue: [], maxCount: 5 },
  'propertyIds.$': String,
};

export const mortgageNotesSchema = {
  mortgageNotes: { type: Array, defaultValue: [] },
  'mortgageNotes.$': Object,
  'mortgageNotes.$.value': { type: Number, min: 0, max: 1000000000 },
  'mortgageNotes.$.rank': { type: Number, min: 0, max: 10 },
  'mortgageNotes.$.type': {
    type: String,
    allowedValues: Object.values(MORTGAGE_NOTE_TYPES),
  },
  'mortgageNotes.$.category': {
    type: String,
    allowedValues: Object.values(MORTGAGE_NOTE_CATEGORIES),
  },
};
