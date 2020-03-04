import SimpleSchema from 'simpl-schema';

import {
  updatedAt,
  createdAt,
  decimalMoneyField,
} from '../../helpers/sharedSchemas';

import { INSURANCE_STATUS } from '../insuranceConstants';

const InsuranceSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  status: {
    type: String,
    allowedValues: Object.values(INSURANCE_STATUS),
    defaultValue: INSURANCE_STATUS.SUGGESTED,
  },
  borrowerLink: { type: Object, optional: true },
  'borrowerLink._id': String,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': String,
  premium: decimalMoneyField,
  singlePremium: { type: Boolean, defaultValue: false },
  duration: { type: SimpleSchema.Integer, optional: true, min: 1, max: 9999 },
  billingDate: { type: Date, optional: true },
});

export default InsuranceSchema;
