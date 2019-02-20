import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import {
  createdAt,
  updatedAt,
  percentageField,
} from '../../helpers/sharedSchemas';
import {
  INCOME_CONSIDERATION_TYPES,
  REAL_ESTATE_CONSIDERATION_TYPES,
  OTHER_EXPENSES_CONSIDERATION_TYPES,
} from '../lenderRulesConstants';

export const incomeConsideration = {
  incomeConsiderationType: {
    type: String,
    allowedValues: Object.values(INCOME_CONSIDERATION_TYPES),
    optional: true,
  },
  bonusConsideration: percentageField,
  bonusHistoryToConsider: { type: SimpleSchema.Integer, optional: true },
  companyIncomeConsideration: percentageField,
  companyIncomeHistoryToConsider: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  dividendsConsideration: percentageField,
  dividendsHistoryToConsider: { type: SimpleSchema.Integer, optional: true },
  realEstateIncomeConsiderationType: {
    type: String,
    allowedValues: Object.values(REAL_ESTATE_CONSIDERATION_TYPES),
    optional: true,
  },
  investmentIncomeConsideration: percentageField,
  otherExpensesConsiderationType: {
    type: String,
    allowedValues: Object.values(OTHER_EXPENSES_CONSIDERATION_TYPES),
    optional: true,
  },
  fortuneReturnsRatio: percentageField,
};

export const theoreticalExpenses = {
  theoreticalInterestRate: percentageField,
  theoreticalInterestRate2ndRank: percentageField,
  theoreticalMaintenanceRate: percentageField,
  amortizationGoal: percentageField,
  amortizationYears: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 20,
    optional: true,
  },
};

export const cutOffCriteria = {
  maxBorrowRatio: percentageField,
  maxIncomeRatio: percentageField,
};

export const otherParams = {
  allowPledge: {
    type: Boolean,
    optional: true,
    autoValue() {
      if (Meteor.isServer && this.isSet && this.value === false) {
        return { $unset: true };
      }
    },
  },
  adminComments: { type: Array, defaultValue: [] },
  'adminComments.$': String,
  pdfComments: { type: Array, defaultValue: [] },
  'pdfComments.$': String,
};

const LenderRulesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
  filter: { type: Object, blackbox: true },
  name: { type: String, optional: true },
  ...incomeConsideration,
  ...theoreticalExpenses,
  ...cutOffCriteria,
  ...otherParams,
});

export const LenderRulesEditorSchema = LenderRulesSchema.pick(
  ...Object.keys(incomeConsideration),
  ...Object.keys(theoreticalExpenses),
  ...Object.keys(cutOffCriteria),
  ...Object.keys(otherParams),
);

export default LenderRulesSchema;
