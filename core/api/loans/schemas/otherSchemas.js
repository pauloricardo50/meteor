// @flow
import { INTEREST_RATES } from '../../constants';

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
};

export const previousLoanTranchesSchema = {
  previousLoanTranches: {
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
    type: Date,
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
