import SimpleSchema from 'simpl-schema';

import {
  updatedAt,
  createdAt,
  decimalMoneyField,
  dateField,
} from '../../helpers/sharedSchemas';

import { INSURANCE_STATUS } from '../insuranceConstants';

const InsuranceSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: { type: String, unique: true, regEx: /^\d{2}-\d{4}-[A-Z]\d{2}/ },
  status: {
    type: String,
    allowedValues: Object.values(INSURANCE_STATUS),
    defaultValue: INSURANCE_STATUS.SUGGESTED,
  },
  description: String,
  borrowerLink: { type: Object, optional: true },
  'borrowerLink._id': String,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': String,
  premium: decimalMoneyField,
  singlePremium: { type: Boolean, defaultValue: false },
  duration: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1,
    max: 9999,
    condition: ({ singlePremium }) => !singlePremium,
  },
  billingDate: { ...dateField, optional: false },
  insuranceProductLink: { type: Object, optional: true },
  'insuranceProductLink._id': String,
  revenueLinks: { type: Array, optional: true },
  'revenueLinks.$': Object,
  'revenueLinks.$._id': String,
});

export default InsuranceSchema;
