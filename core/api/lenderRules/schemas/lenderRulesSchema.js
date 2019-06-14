import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import {
  BONUS_ALGORITHMS,
  REAL_ESTATE_INCOME_ALGORITHMS,
} from '../../../config/financeConstants';
import {
  createdAt,
  updatedAt,
  percentageField,
} from '../../helpers/sharedSchemas';
import {
  INCOME_CONSIDERATION_TYPES,
  EXPENSE_TYPES_WITHOUT_DELTAS,
} from '../lenderRulesConstants';

// When adding new rules to lenderRules, make sure to edit the
// applyRules method on LenderRulesInitializator

export const incomeConsideration = {
  incomeConsiderationType: {
    type: String,
    allowedValues: Object.values(INCOME_CONSIDERATION_TYPES),
    optional: true,
  },
  bonusAlgorithm: {
    type: String,
    allowedValues: Object.values(BONUS_ALGORITHMS),
    optional: true,
    uniforms: { placeholder: null },
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
  realEstateIncomeAlgorithm: {
    type: String,
    allowedValues: Object.values(REAL_ESTATE_INCOME_ALGORITHMS),
    optional: true,
    uniforms: { placeholder: null },
  },
  realEstateIncomeConsideration: percentageField,
  // realEstateIncomeConsiderationType: {
  //   type: String,
  //   allowedValues: Object.values(REAL_ESTATE_CONSIDERATION_TYPES),
  //   optional: true,
  // },
  investmentIncomeConsideration: percentageField,
  expensesSubtractFromIncome: {
    type: Array,
    optional: true,
    uniforms: {
      intlId: 'expenses',
      placeholder: 'Ajouter toutes les charges aux charges théoriques',
      label: 'Charges à soustraire aux revenus',
    },
    autoValue() {
      if (
        Meteor.isServer
        && this.isSet
        && Array.isArray(this.value)
        && this.value.length === 0
      ) {
        return { $unset: true };
      }
    },
  },
  'expensesSubtractFromIncome.$': {
    type: String,
    // REAL_ESTATE_DELTAS are handled internally
    allowedValues: EXPENSE_TYPES_WITHOUT_DELTAS,
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
  maxBorrowRatioWithPledge: percentageField,
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
  order: { type: Number, min: 0 },
  organisationCache: {
    type: Object,
    blackbox: true,
    optional: true,
  },
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
