import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';


export const GeneralSchema = new SimpleSchema({
  purchaseType: { // acquisition, refinancing, construction
    type: String,
    defaultValue: '',
  },
  usageType: { // primary, secondary or investment
    type: String,
    defaultValue: 'primary',
  },
  genderRequired: Boolean,
  fortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
  },
  insuranceFortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
  },
  incomeUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    // autoValue: function () {
    //   return 0;
    // },
  },
  maxCash: {
    type: Boolean,
    defaultValue: true,
  },
  maxDebt: {
    type: Boolean,
    defaultValue: true,
  },
  partnersToAvoidExists: {
    type: Boolean,
    defaultValue: false,
  },
  partnersToAvoid: {
    type: Array,
    defaultValue: [],
  },
  'partnersToAvoid.$': String,
  selectedPartner: {
    type: String,
    optional: true,
  },
  loanTranches: {
    type: Array,
    minCount: 1,
    defaultValue: [
      {
        type: 'interestLibor',
        value: 100000,
      },
    ],
  },
  'loanTranches.$': Object,
  'loanTranches.$.type': { // libor, floating, 1y, 2y, 5y, 10y
    type: String,
    optional: true,
  },
  'loanTranches.$.value': {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  currentOwner: { // '0', '1', 'both', 'other'
    type: String,
    defaultValue: '0',
  },
  futureOwner: { // '0', '1', 'both', 'other'
    type: String,
    defaultValue: '0',
  },
  otherOwner: {
    type: String,
    optional: true,
  },
  borrowersHaveSameAddress: {
    type: Boolean,
    defaultValue: false,
  },
});


// Schema to store information about each borrower
export const BorrowerSchema = new SimpleSchema({
  gender: {
    type: String,
    optional: true,
  },
  age: {
    type: Number,
    optional: true,
    min: 18,
    max: 99,
  },
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: Number,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: {
    type: String,
    optional: true,
  },
  citizenships: {
    type: String,
    optional: true,
  },
  residencyPermit: {
    type: String,
    optional: true,
  },
  birthDate: {
    type: String,
    optional: true,
    regEx: '/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/', // YYYY-MM-DD
  },
  birthPlace: {
    type: String,
    optional: true,
  },
  civilStatus: { // 'married', 'pacsed', 'single', 'divorced'
    type: String,
    defaultValue: 'single',
  },
  company: {
    type: String,
    optional: true,
  },
  grossIncome: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  bonusExists: {
    type: Boolean,
    defaultValue: false,
  },
  bonus: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  otherIncome: {
    type: Array,
    optional: true,
  },
  'otherIncome.$.amount': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherIncome.$.description': String,
  personalBank: {
    type: String,
    optional: true,
  },
  corporateBankExists: {
    type: Boolean,
    defaultValue: false,
  },
  corporateBank: {
    type: Boolean,
    optional: true,
  },
  currentRentExists: {
    type: Boolean,
    defaultValue: false,
  },
  currentRent: { // Monthly
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
  cashAndSecurities: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  existingDebt: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  otherFortune: {
    type: Array,
    optional: true,
  },
  'otherFortune.$.amount': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherFortune.$.description': String,
  insuranceLpp: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurance3A: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurance3B: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurancePureRisk: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  files: { // TODO
    type: Object,
    optional: true,
  },
});


export const PropertySchema = new SimpleSchema({
  value: { // Cost of the property
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  style: { // villa, flat,
    type: String,
    optional: true,
    defaultValue: 'flat',
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: Number,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: {
    type: String,
    optional: true,
  },
  insideArea: { // inside
    type: Number,
    optional: true,
  },
  landArea: { // land area
    type: Number,
    optional: true,
  },
  roomCount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  bathroomCount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  toiletCount: {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  volume: {
    type: Number,
    optional: true,
    min: 0,
    max: 5000,
  },
  parking: {
    type: Object,
    defaultValue: {},
  },
  'parking.inside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.box': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.outsideCovered': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.outsideNotCovered': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  minergie: {
    type: Boolean,
    defaultValue: false,
  },
  other: {
    type: String,
    optional: true,
  },
  pictures: {
    type: Array,
    optional: true,
  },
  files: {
    type: Array,
    optional: true,
  },
});


const singleOffer = new SimpleSchema({
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


// Contains all fields submitted by an individual lender/partner
export const PartnerOfferSchema = new SimpleSchema({
  name: {
    type: String,
  },
  standardOffer: {
    type: singleOffer,
  },
  conditionsOffer: {
    type: singleOffer,
  },
  conditions: {
    type: String,
  },
  expertiseRequired: {
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
  uploadTaxesLater: {
    type: Boolean,
    defaultValue: true,
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
  hasChosenStrategy: {
    type: Boolean,
    defaultValue: false,
  },
});
