// @flow
import { INTEREST_RATES } from '../../constants';
import { moneyField } from '../../helpers/sharedSchemas';

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
    ...moneyField,
    type: Number, // Can be specified as percentages or monetary amounts
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
    ...moneyField,
    type: Number, // Can be specified as percentages or monetary amounts
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
