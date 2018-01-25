import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { getFileSchema } from '../files/files';
import {
  GeneralSchema,
  PropertySchema,
  LogicSchema,
} from './additionalSchemas';
import { REQUEST_STATUS } from './loanrequestConstants';

const LoanRequests = new Mongo.Collection('loanRequests');

const RequestFilesSchema = new SimpleSchema(getFileSchema('request'));

// Prevent all client side modifications of mongoDB
LoanRequests.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
LoanRequests.allow({
  insert: () => true,
  update: () => false,
  remove: () => false,
});

// Documentation is in the google drive dev/MongoDB Schemas
const LoanRequestSchema = new SimpleSchema({
  userId: {
    type: String,
    index: true,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      // Verify the update is from the user owning this doc, ignoring admin/partner updates
      const doc = LoanRequests.findOne(
        { _id: this.docId },
        { fields: { userId: 1 } },
      );

      if (this.isInsert) {
        return new Date();
      } else if (this.isUpdate && doc && this.userId === doc.userId) {
        return new Date();
      }
    },
  },
  status: {
    type: String,
    defaultValue: REQUEST_STATUS.ACTIVE,
    allowedValues: Object.values(REQUEST_STATUS),
  },
  name: { type: String, optional: true, defaultValue: '' },
  general: { type: GeneralSchema, defaultValue: {} },
  borrowers: { type: Array, defaultValue: [] },
  'borrowers.$': String,
  // property: PropertySchema,
  property: String,
  files: { type: RequestFilesSchema, defaultValue: {} },
  logic: { type: LogicSchema, defaultValue: {} },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  emails: { type: Array, defaultValue: [] },
  'emails.$': Object,
  'emails.$._id': String,
  'emails.$.emailId': String,
  'emails.$.status': String,
  'emails.$.updatedAt': Date,
  'emails.$.scheduledAt': { type: Date, optional: true },
});

// Finally, attach schema to the Mongo collection and export
LoanRequests.attachSchema(LoanRequestSchema);
export default LoanRequests;
