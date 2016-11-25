import { SimpleSchema } from 'meteor/aldeed:simple-schema';


// Personal information about the user, like address, age, family
export const PersonalInfoSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  twoBuyers: {
    type: String,
    defaultValue: 'false',
    optional: true,
  },
  age1: {
    type: Number,
    optional: true,
    min: 18,
    max: 99,
  },
  age2: {
    type: Number,
    optional: true,
    min: 18,
    max: 99,
  },
  genderRequired: {
    type: String,
    defaultValue: 'false',
    optional: true,
  },
  gender1: {
    type: String,
    optional: true,
  },
  gender2: {
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
    max: 100000000,
  },
  bonusExists: {
    type: String,
    defaultValue: 'false',
    optional: true,
  },
  bonus: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  fortune: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insuranceFortune: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  personalBank: {
    type: String,
    optional: true,
    max: 200,
  },
  corporateBankExists: {
    type: String,
    defaultValue: 'false',
  },
  corporateBank: {
    type: String,
    optional: true,
    max: 200,
  },
  avoidLenderExists: {
    type: String,
    defaultValue: 'false',
  },
  avoidLender: {
    type: String,
    optional: true,
    max: 1000,
  },
  maxCash: {
    type: String,
    defaultValue: 'true',
    optional: true,
  },
  maxDebt: {
    type: String,
    defaultValue: 'true',
    optional: true,
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
  type: { // primary, secondary or investment
    type: String,
    defaultValue: 'primary',
    optional: true,
  },
});

// Name and URL of a single file uploaded by the user
const SingleFileSchema = new SimpleSchema({
  url: {
    type: String,
  // regEx: SimpleSchema.RegEx.Url, TODO put this back when upload works
  },
});

// Name and URL of a single file uploaded by the user
export const FileSchema = new SimpleSchema({
  taxes: {
    type: SingleFileSchema,
    optional: true,
  },
  housePicture: {
    type: SingleFileSchema,
    optional: true,
  },
});


// Contains all fields submitted by an individual lender
export const LenderOfferSchema = new SimpleSchema({
  lender: {
    type: String,
  },
  maxAmount: {
    type: Number,
    min: 0,
    max: 100000000,
  },
  amortizing: {
    type: Number,
  },
  interestLibor: {
    type: Number,
    min: 0,
    max: 100,
  },
  interest2: {
    type: Number,
    min: 0,
    max: 100,
  },
  interest5: {
    type: Number,
    min: 0,
    max: 100,
  },
  interest10: {
    type: Number,
    min: 0,
    max: 100,
  },
  conditions: {
    type: String,
  },
  expertise: {
    type: Boolean,
  },
});

// All logic fields required by the app to trigger the right things at the right time
export const LogicSchema = new SimpleSchema({
  step: {
    type: Number,
    defaultValue: 0,
    min: 0,
    max: 5,
  },
  auctionStarted: {
    type: Boolean,
    defaultValue: false,
  },
  auctionStartTime: {
    type: Date,
    optional: true,
  },
  auctionEndTime: {
    type: Date,
    optional: true,
  },
});

// Data added by e-Potek employees to this request, including customer support interactions
export const AdminInfoSchema = new SimpleSchema({
  notes: {
    type: String,
    optional: true,
  },
});
