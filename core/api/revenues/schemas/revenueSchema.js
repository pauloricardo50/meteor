import SimpleSchema from 'simpl-schema';

import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/constants';
import {
  createdAt,
  updatedAt,
  percentageField,
  decimalNegativeMoneyField,
  cacheField,
} from '../../helpers/sharedSchemas';
import {
  REVENUE_TYPES,
  REVENUE_STATUS,
  COMMISSION_STATUS,
} from '../revenueConstants';

const RevenueSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  amount: { ...decimalNegativeMoneyField, optional: false },
  description: { type: String, optional: true },
  type: {
    type: String,
    allowedValues: Object.values(REVENUE_TYPES),
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  status: {
    type: String,
    allowedValues: Object.values(REVENUE_STATUS),
    uniforms: { displayEmpty: false, placeholder: '' },
    defaultValue: REVENUE_STATUS.EXPECTED,
  },
  expectedAt: {
    type: Date,
    optional: false,
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
  'organisationLinks.$.commissionRate': { ...percentageField, optional: false },
  'organisationLinks.$.paidAt': {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  'organisationLinks.$.status': {
    type: String,
    allowedValues: Object.values(COMMISSION_STATUS),
    defaultValue: COMMISSION_STATUS.TO_BE_PAID,
  },
  sourceOrganisationLink: { type: Object, defaultValue: {}, optional: true },
  'sourceOrganisationLink._id': { type: String, optional: true },
  // This should be an object, since there's only one loan
  // https://github.com/Herteby/denormalize/issues/17
  loanCache: { type: Array, optional: true },
  'loanCache.$': cacheField,
  assigneeLink: { type: Object, optional: true },
  'assigneeLink._id': { type: String },
  insuranceRequestCache: { type: Array, optional: true },
  'insuranceRequestCache.$': cacheField,
  insuranceCache: { type: Array, optional: true },
  'insuranceCache.$': cacheField,
});

export default RevenueSchema;
