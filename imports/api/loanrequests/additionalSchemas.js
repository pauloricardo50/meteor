import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';

import { GeneralFilesSchema, PropertyFilesSchema } from '../FileSchemas';

export const GeneralSchema = new SimpleSchema({
  purchaseType: {
    // acquisition, refinancing, construction
    type: String,
    defaultValue: '',
  },
  usageType: {
    // primary, secondary or investment
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
  canton: {
    type: String,
    optional: true,
    min: 2,
    max: 2,
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
  'loanTranches.$.type': {
    // libor, floating, 1y, 2y, 5y, 10y
    type: String,
    optional: true,
  },
  'loanTranches.$.value': {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  currentOwner: {
    // '0', '1', 'both', 'other'
    type: String,
    defaultValue: '0',
  },
  futureOwner: {
    // '0', '1', 'both', 'other'
    type: String,
    defaultValue: '0',
  },
  otherOwner: {
    type: String,
    optional: true,
  },
  borrowersHaveSameAddress: {
    type: Boolean,
    defaultValue: true,
  },
  files: {
    type: GeneralFilesSchema,
    defaultValue: {},
  },
});

export const PropertySchema = new SimpleSchema({
  value: {
    // Cost of the property
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  style: {
    // villa, flat,
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
  insideArea: {
    // inside
    type: Number,
    optional: true,
  },
  landArea: {
    // land area
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
    type: PropertyFilesSchema,
    defaultValue: {},
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
  auctionVerified: {
    type: Boolean,
    defaultValue: false,
  },
  hasValidatedCashStrategy: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  loanStrategyPreset: {
    type: String,
    defaultValue: '',
    optional: true,
  },
  amortizingStrategyPreset: {
    type: String,
    defaultValue: '',
    optional: true,
  },
});
