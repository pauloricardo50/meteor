import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  moneyField,
  percentageField,
} from '../../helpers/sharedSchemas';
import {
  REVENUES_TYPES,
  REVENUES_STATUS,
  COMMISSION_STATUS,
} from '../revenueConstants';

const RevenueSchema = new SimpleSchema({
  createdAt,
  updatedAt,

  approximation: { type: Boolean, defaultValue: true },
  amount: moneyField,
  type: {
    type: String,
    allowedValues: Object.values(REVENUES_TYPES),
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  description: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: Object.values(REVENUES_STATUS),
    uniforms: { displayEmpty: false, placeholder: '' },
  },
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
  },
});

export default RevenueSchema;
