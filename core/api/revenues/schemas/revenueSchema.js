import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  moneyField,
  percentageField,
} from '../../helpers/sharedSchemas';
import {
  REVENUE_TYPES,
  REVENUE_STATUS,
  COMMISSION_STATUS,
} from '../revenueConstants';

const RevenueSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  approximation: { type: Boolean, defaultValue: true },
  amount: moneyField,
  type: {
    type: String,
    allowedValues: Object.values(REVENUE_TYPES),
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  description: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: Object.values(REVENUE_STATUS),
    uniforms: { displayEmpty: false, placeholder: '' },
    defaultValue: REVENUE_STATUS.EXPECTED,
  },
  expectedAt: { type: Date, optional: true },
  paidAt: { type: Date, optional: true },
  organisationLinks: {
    type: Array,
    defaultValue: [],
  },
  'organisationLinks.$': Object,
  'organisationLinks.$._id': String,
  'organisationLinks.$.commissionRate': percentageField,
  'organisationLinks.$.paidDate': { type: Date, optional: true },
  'organisationLinks.$.status': {
    type: String,
    allowedValues: Object.values(COMMISSION_STATUS),
    defaultValue: COMMISSION_STATUS.TO_BE_PAID,
  },
});

export default RevenueSchema;
