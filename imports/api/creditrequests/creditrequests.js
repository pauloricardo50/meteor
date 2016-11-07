import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  PersonalInfoSchema, FinancialInfoSchema, PropertyInfoSchema, FileSchema,
  LenderOfferSchema, LogicSchema, AdminInfoSchema,
} from './additionalSchemas.js';

const CreditRequests = new Mongo.Collection('creditRequests');


CreditRequests.allow({
  insert(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
});


const CreditRequestSchema = new SimpleSchema({
  userId: {
    type: String,
    autoValue() {
      return this.userId;
    },
  },
  createdAt: {
    type: Date,
    autoValue() {
      return new Date();
    },
  },
  updatedAt: { // Force value to be current date (on server) upon update and don't allow it to be set upon insert
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
      return '';
    },
    denyInsert: true,
    optional: true,
  },
  active: {
    type: Boolean,
    defaultValue: false,
  },
  requestName: {
    type: String,
  },
  personalInfo: {
    type: PersonalInfoSchema,
    defaultValue: {},
  },
  financialInfo: {
    type: FinancialInfoSchema,
    defaultValue: {},
  },
  propertyInfo: {
    type: PropertyInfoSchema,
    defaultValue: {},
  },
  files: {
    type: [FileSchema],
    defaultValue: [],
  },
  lenderOffers: {
    type: [LenderOfferSchema],
    defaultValue: [],
  },
  logic: {
    type: LogicSchema,
    defaultValue: {},
  },
  adminInfo: {
    type: AdminInfoSchema,
    defaultValue: {},
  },
});


// Finally, attach schema to the Mongo collection and export
CreditRequests.attachSchema(CreditRequestSchema);
export default CreditRequests;
