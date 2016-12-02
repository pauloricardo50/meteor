import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  PersonalInfoSchema, FinancialInfoSchema, PropertyInfoSchema, FileSchema,
  PartnerOfferSchema, LogicSchema, AdminInfoSchema,
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
  // Force value to be current date (on server) upon update and don't allow it to be set upon insert
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
      return undefined;
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
  type: { // acquisition, refinancing
    type: String,
    defaultValue: 'acquisition',
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
    type: FileSchema,
    defaultValue: {},
  },
  lenderOffers: {
    type: [PartnerOfferSchema],
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
