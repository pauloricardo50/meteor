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
  active: {
    type: Boolean,
    defaultValue: false,
  },
  requestName: {
    type: String,
  },
  personalInfo: {
    type: PersonalInfoSchema,
    optional: true,
  },
  financialInfo: {
    type: FinancialInfoSchema,
    optional: true,
  },
  propertyInfo: {
    type: PropertyInfoSchema,
    optional: true,
  },
  files: {
    type: [FileSchema],
    optional: true,
  },
  lenderOffers: {
    type: [LenderOfferSchema],
    optional: true,
  },
  logic: {
    type: LogicSchema,
  },
  adminInfo: {
    type: AdminInfoSchema,
    optional: true,
  },
});


// Finally, attach schema to the Mongo collection and export
CreditRequests.attachSchema(CreditRequestSchema);
export default CreditRequests;
