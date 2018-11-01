// @flow
import SimpleSchema from 'simpl-schema';
import { INTEREST_RATES } from '../../constants';

export const borrowerIdsSchema = {
  borrowerIds: { type: Array, defaultValue: [] },
  'borrowerIds.$': String,
};

export const loanTranchesSchema = {
  loanTranches: {
    type: Array,
    defaultValue: [{ type: INTEREST_RATES.YEARS_10, value: 1 }],
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
};

export type loanTranchesType = Array<{
  type: string,
  value: number,
}>;
export const propertyIdsSchema = {
  propertyIds: { type: Array, defaultValue: [] },
  'propertyIds.$': String,
};
