import SimpleSchema from 'simpl-schema';

import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import {
  createdAt,
  updatedAt,
  moneyField,
  percentageField,
  decimalMoneyField,
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
  amount: decimalMoneyField,
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
  expectedAt: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  paidAt: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  organisationLinks: {
    type: Array,
    defaultValue: [],
  },
  'organisationLinks.$': Object,
  'organisationLinks.$._id': String,
  'organisationLinks.$.commissionRate': percentageField,
  'organisationLinks.$.paidDate': {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  'organisationLinks.$.status': {
    type: String,
    allowedValues: Object.values(COMMISSION_STATUS),
    defaultValue: COMMISSION_STATUS.TO_BE_PAID,
  },
});

export default RevenueSchema;
