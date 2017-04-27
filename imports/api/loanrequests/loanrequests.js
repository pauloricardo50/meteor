import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Factory } from 'meteor/dburles:factory';

import { GeneralSchema, PropertySchema, LogicSchema } from './additionalSchemas';

const LoanRequests = new Mongo.Collection('loanRequests');

LoanRequests.allow({
  insert(userId, doc) {
    return userId ? true : new Error();
  },
  update(userId, doc) {
    // This is true if someone is logged in and the user is the same as the one who created it
    return !!userId && userId === doc.userId;
  },
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
      if (this.isUpdate && this.userId === doc.userId) {
        return new Date();
      } else if (this.isInsert) {
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
  logic: {
    type: LogicSchema,
    defaultValue: {},
  },
  admin: {
    // TODO
    type: Object,
    optional: true,
  },
});

// Finally, attach schema to the Mongo collection and export
LoanRequests.attachSchema(LoanRequestSchema);
export default LoanRequests;

Factory.define('loanRequest', LoanRequests, {
  userId: () => 'random_id',
  createdAt: () => new Date(),
  general: () => ({ fortuneUsed: 250000, partnersToAvoid: ['joe', 'john'] }),
  borrowers: () => 'exampleId',
  property: () => ({ value: 1000000 }),
  logic: () => ({}),
  admin: () => ({}),
});
