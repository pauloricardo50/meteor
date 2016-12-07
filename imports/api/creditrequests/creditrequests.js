import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  LoanInfoSchema, PersonalInfoSchema, FinancialInfoSchema, PropertyInfoSchema, FileSchema,
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
  userId: { // The user ID of the creator
    type: String,
    autoValue() {
      return this.userId;
    },
  },
  createdAt: { // Date at which the request was created
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
      return undefined;
    },
    denyInsert: true,
    optional: true,
  },
  active: { // Whether this is the request currently being worked on by the user
    type: Boolean,
    defaultValue: false,
  },
  requestName: { // To identify a loan internally
    type: String,
  },
  type: { // acquisition, refinancing
    type: String,
    defaultValue: 'acquisition',
  },
  loanInfo: { // Contains all info about the actual loan
    type: LoanInfoSchema,
    defaultValue: {},
  },
  personalInfo: { // Personal information, ex: address, age, etc.
    type: PersonalInfoSchema,
    defaultValue: {},
  },
  financialInfo: { // Financial info, ex: salary, fortune, expenses, etc.
    type: FinancialInfoSchema,
    defaultValue: {},
  },
  propertyInfo: { // Property info, ex: size, value, nb of rooms, etc.
    type: PropertyInfoSchema,
    defaultValue: {},
  },
  files: { // All files submitted by the user
    type: FileSchema,
    defaultValue: {},
  },
  lenderOffers: { // All the offers from banks and insurances
    type: [PartnerOfferSchema],
    defaultValue: [],
  },
  logic: { // Internal logic of the app
    type: LogicSchema,
    defaultValue: {},
  },
  adminInfo: { // Interactions, notes, between e-Potek and the user
    type: AdminInfoSchema,
    defaultValue: {},
  },
});


// Finally, attach schema to the Mongo collection and export
CreditRequests.attachSchema(CreditRequestSchema);
export default CreditRequests;
