import SimpleSchema from 'simpl-schema';

import {
  updatedAt,
  createdAt,
  cacheField,
  adminNotesSchema,
} from '../../helpers/sharedSchemas';

import { INSURANCE_REQUEST_STATUS } from '../insuranceRequestConstants';

const InsuranceRequestSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: { type: String, unique: true, regEx: /^\d{2}-\d{4}-A$/ },
  status: {
    type: String,
    allowedValues: Object.values(INSURANCE_REQUEST_STATUS),
    defaultValue: INSURANCE_REQUEST_STATUS.LEAD,
  },
  userLink: { type: Object, optional: true },
  'userLink._id': String,
  userCache: cacheField,
  borrowerLinks: { type: Array, optional: true, defaultValue: [] },
  'borrowerLinks.$': Object,
  'borrowerLinks.$._id': String,
  assigneeLinks: { type: Array, optional: true },
  'assigneeLinks.$': Object,
  'assigneeLinks.$._id': String,
  'assigneeLinks.$.percent': {
    type: SimpleSchema.Integer,
    min: 10,
    max: 100,
    defaultValue: 100,
    allowedValues: [...Array(10)].map((_, i) => 10 * (i + 1)),
  },
  revenueLinks: {
    type: Array,
    optional: true,
    autoValue() {
      // Avoid a weird edge case where removing revenues would cause this
      // potential empty array to throw on MongoDB with: `E11000 duplicate key error collection: meteor.loans index: revenueLinks_1 dup key: { : undefined }`
      if (this.isSet && Array.isArray(this.value) && this.value.length === 0) {
        this.unset();
      }
    },
  },
  'revenueLinks.$': String,
  ...adminNotesSchema,
  proNote: {
    type: new SimpleSchema(adminNotesSchema).getObjectSchema('adminNotes.$'),
    optional: true,
  },
  tasksCache: { type: Array, optional: true },
  'tasksCache.$': cacheField,
  insuranceLinks: { type: Array, optional: true, defaultValue: [] },
  'insuranceLinks.$': Object,
  'insuranceLinks.$._id': String,
  loanCache: cacheField,
});

export default InsuranceRequestSchema;
