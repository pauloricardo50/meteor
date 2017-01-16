import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {
  GeneralSchema, BorrowerSchema, PropertySchema, PartnerOfferSchema, LogicSchema,
} from './additionalSchemas.js';


const LoanRequests = new Mongo.Collection('loanRequests');


LoanRequests.allow({
  insert(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update(userId, doc) {
    // This is true if someone is logged in and the user is the same as the one who created it
    return !!userId && (userId === doc.userId);
  },
});


// Documentation is in the google drive dev/MongoDB Schemas
const LoanRequestSchema = new SimpleSchema({
  userId: {
    type: String,
    index: true,
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    },
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
    optional: true,
    autoValue() {
      if (this.isUpdate && (this.userId === this.fied('userId').value)) {
        return new Date();
      }
      return undefined;
    },
  },
  active: {
    type: Boolean,
    defaultValue: false,
  },
  general: {
    type: GeneralSchema,
    defaultValue: {},
  },
  borrowers: {
    type: Array,
  },
  'borrowers.$': {
    type: BorrowerSchema,
  },
  property: {
    type: PropertySchema,
  },
  partnerOffers: {
    type: Array,
    defaultValue: [],
  },
  'partnerOffers.$': {
    type: PartnerOfferSchema,
  },
  logic: {
    type: LogicSchema,
    defaultValue: {},
  },
  admin: { // TODO
    type: Object,
    optional: true,
  },
});


// Finally, attach schema to the Mongo collection and export
LoanRequests.attachSchema(LoanRequestSchema);
export default LoanRequests;
