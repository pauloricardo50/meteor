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

export const loanTranchesSchema = {
  loanTranches: {
    type: Array,
    defaultValue: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
    optional: true,
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
};

export const previousLoanTranchesSchema = {
  loanTranches: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'previousLoanTranches.$': Object,
  'previousLoanTranches.$.value': {
    type: Number,
    optional: true,
    min: 0,
    max: 1000000000, // Can be specified as percentages or monetary amounts
  },
  'previousLoanTranches.$.dueDate': {
    type: String,
    optional: true,
  },
  'previousLoanTranches.$.rate': {
    type: Number,
    min: 0,
    max: 1,
  },
};

export type loanTranchesType = Array<{
  type: string,
  value: number,
}>;

export const propertyIdsSchema = {
  propertyIds: { type: Array, defaultValue: [], maxCount: 5 },
  'propertyIds.$': String,
};

export const mortgageNotesSchema = {
  mortgageNotes: { type: Array, defaultValue: [], optional: true },
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
