import { SimpleSchema } from 'meteor/aldeed:simple-schema';


// Personal information about the user, like address, age, family
export const PersonalInfoSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
});

// Financial information about the user, like salary, fortune and insurance
export const FinancialInfoSchema = new SimpleSchema({
  salary: {
    type: Number,
    optional: true,
    min: 0,
    max: 10000000,
  },
});

// Information about the property, like room count, property value and address
export const PropertyInfoSchema = new SimpleSchema({
  value: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
});

// Name and URL of a single file uploaded by the user
export const FileSchema = new SimpleSchema({
  name: {
    type: String,
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
});

// Contains all fields submitted by an individual lender
export const LenderOfferSchema = new SimpleSchema({
  lender: {
    type: String,
  },
});

// All logic fields required by the app to trigger the right things at the right time
export const LogicSchema = new SimpleSchema({
  step: {
    type: Number,
    defaultValue: 0,
    min: 0,
    max: 6,
  },
});

// Data added by e-Potek employees to this request, including customer support interactions
export const AdminInfoSchema = new SimpleSchema({
  notes: {
    type: String,
    optional: true,
  },
});
