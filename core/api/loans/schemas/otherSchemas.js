import { INTEREST_RATES, SOLVENCY_TYPE, CANTONS } from '../../constants';
import { moneyField, percentageField } from '../../helpers/sharedSchemas';

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

export const propertyIdsSchema = {
  propertyIds: { type: Array, defaultValue: [], maxCount: 5 },
  'propertyIds.$': String,
};

export const maxPropertyValueSchema = {
  maxPropertyValue: { type: Object, optional: true },
  'maxPropertyValue.type': {
    type: String,
    allowedValues: Object.values(SOLVENCY_TYPE),
    defaultValue: SOLVENCY_TYPE.SIMPLE,
  },
  'maxPropertyValue.canton': {
    type: String,
    allowedValues: Object.keys(CANTONS),
  },
  'maxPropertyValue.borrowerHash': { type: String, optional: true },
  'maxPropertyValue.date': Date,
  'maxPropertyValue.main': Object,
  'maxPropertyValue.main.min': { type: Object, optional: true },
  'maxPropertyValue.main.min.propertyValue': moneyField,
  'maxPropertyValue.main.min.borrowRatio': percentageField,
  'maxPropertyValue.main.min.organisationName': String,
  'maxPropertyValue.main.max': Object,
  'maxPropertyValue.main.max.propertyValue': moneyField,
  'maxPropertyValue.main.max.borrowRatio': percentageField,
  'maxPropertyValue.main.max.organisationName': String,
  'maxPropertyValue.second': Object,
  'maxPropertyValue.second.min': { type: Object, optional: true },
  'maxPropertyValue.second.min.propertyValue': moneyField,
  'maxPropertyValue.second.min.borrowRatio': percentageField,
  'maxPropertyValue.second.min.organisationName': String,
  'maxPropertyValue.second.max': Object,
  'maxPropertyValue.second.max.propertyValue': moneyField,
  'maxPropertyValue.second.max.borrowRatio': percentageField,
  'maxPropertyValue.second.max.organisationName': String,
};
