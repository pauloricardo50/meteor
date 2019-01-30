import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  percentageField,
} from '../../helpers/sharedSchemas';

const LenderRulesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
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
  comments: { type: Array, defaultValue: [] },
  'comments.$': String,
  name: { type: String, optional: true },
});

export const LenderRulesEditorSchema = LenderRulesSchema.omit(
  'updatedAt',
  'createdAt',
  'organisationLink',
  'filter',
  'name',
);

export default LenderRulesSchema;
