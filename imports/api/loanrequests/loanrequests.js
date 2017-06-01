import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { GeneralSchema, PropertySchema, LogicSchema } from './additionalSchemas';
import { getFileSchema } from '/imports/js/arrays/files';

const RequestFilesSchema = new SimpleSchema(getFileSchema('request'));

const LoanRequests = new Mongo.Collection('loanRequests');

// Prevent all client side modifications of mongoDB
LoanRequests.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

// Documentation is in the google drive dev/MongoDB Schemas
const LoanRequestSchema = new SimpleSchema({
  userId: {
    type: String,
    index: true,
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
      const doc = LoanRequests.findOne({ _id: this.docId }, { fields: { userId: 1 } });

      if (this.isInsert) {
        return new Date();
      } else if (this.isUpdate && doc && this.userId === doc.userId) {
        return new Date();
      }
    },
  },
  name: {
    type: String,
    optional: true,
    defaultValue: '',
  },
  general: {
    type: GeneralSchema,
    defaultValue: {},
  },
  borrowers: {
    type: Array,
  },
  'borrowers.$': {
    type: String,
  },
  property: {
    type: PropertySchema,
  },
  files: {
    type: RequestFilesSchema,
    defaultValue: {},
  },
  logic: {
    type: LogicSchema,
    defaultValue: {},
  },
  admin: {
    // TODO
    type: Object,
    optional: true,
  },
  adminValidation: {
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
});

// Finally, attach schema to the Mongo collection and export
LoanRequests.attachSchema(LoanRequestSchema);
export default LoanRequests;
