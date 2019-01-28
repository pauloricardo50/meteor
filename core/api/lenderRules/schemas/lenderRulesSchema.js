import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  percentageField,
} from '../../helpers/sharedSchemas';

export const filterSchema = new SimpleSchema({
  id: String,
  filter: {
    type: Object,
    blackbox: true,
  },
  maxBorrowRatio: percentageField,
  maxIncomeRatio: percentageField,
  maxIncomeRatioTight: percentageField,
  minCash: percentageField,
  theoreticalInterestRate: percentageField,
  theoreticalMaintenanceRate: percentageField,
});

const LenderRulesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
  filters: { type: Array, defaultValue: [] },
  'filters.$': filterSchema,
});

export const LenderRulesMathSchema = LenderRulesSchema.omit(
  'updatedAt',
  'createdAt',
  'organisationLink',
  'filters',
);

export default LenderRulesSchema;
