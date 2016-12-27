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
  currentRentExists: {
    type: String,
    defaultValue: 'false',
    optional: true,
  },
  currentRent: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  realEstateFortune: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  totalCashFortune: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  otherFortuneExists: {
    type: String,
    defaultValue: 'false',
    optional: true,
  },
  otherFortune: {
    type: [otherFortuneSchema],
    defaultValue: [{}],
  },
});

// Information about the property, like room count, property value and address
export const PropertyInfoSchema = new SimpleSchema({
  value: { // Cost of the property
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  purchaseType: { // acquisition, refinancing, construction
    type: String,
    optional: true,
    defaultValue: '',
  },
  type: { // primary, secondary or investment
    type: String,
    defaultValue: 'primary',
    optional: true,
  },
  style: { // villa, flat,
    type: String,
    defaultValue: '',
    optional: true,
  },
  surface: { // inside
    type: Number,
    defaultValue: undefined,
    optional: true,
  },
  surfaceTotal: { // inside and outside
    type: Number,
    defaultValue: undefined,
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

// List of all files
export const FileSchema = new SimpleSchema({
  willUploadTaxes: {
    type: Boolean,
    defaultValue: true,
  },
  taxes: {
    type: SingleFileSchema,
    optional: true,
  },
  housePicture: {
    type: SingleFileSchema,
    optional: true,
  },
});


// Contains all fields submitted by an individual lender/partner
export const PartnerOfferSchema = new SimpleSchema({
  name: {
    type: String,
  },
  standard: {
    type: singleOffer,
    defaultValue: {},
  },
  withConditions: {
    type: singleOffer,
    defaultValue: {},
  },
  conditions: {
    type: String,
  },
  expertise: {
    type: Boolean,
  },
});

export const singleOffer = new SimpleSchema({
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
  interestFloating: {
    type: Number,
    min: 0,
    max: 100,
  },
  interest1: {
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
  interest7: {
    type: Number,
    min: 0,
    max: 100,
  },
  interest10: {
    type: Number,
    min: 0,
    max: 100,
  },
  interest15: {
    type: Number,
    min: 0,
    max: 100,
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
  hasChosenStrategyOnce: {
    type: Boolean,
    defaultValue: false,
  },
});

// Data added by e-Potek employees to this request, including customer support interactions
export const AdminInfoSchema = new SimpleSchema({
  notes: {
    type: String,
    optional: true,
  },
});

export const otherFortuneSchema = new SimpleSchema({
  value: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  description: {
    type: String,
    optional: true,
    defaultValue: '',
  },
});

export const LoanInfoSchema = new SimpleSchema({
  lender: {
    type: String,
    optional: true,
  },
  amount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  tranches: {
    type: [Object],
    minCount: 1,
    defaultValue: [
      {
        type: 'interestLibor',
        value: 100000,
      },
    ],
  },
  'tranches.$.type': { // libor, floating, 1y, 2y, 5y, 10y
    type: String,
    optional: true,
  },
  'tranches.$.value': {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
});
