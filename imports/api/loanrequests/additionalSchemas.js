import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';

import { GeneralFilesSchema, PropertyFilesSchema } from '../FileSchemas';

export const GeneralSchema = new SimpleSchema({
  purchaseType: {
    // acquisition, refinancing, construction
    type: String,
    defaultValue: 'acquisition',
  },
  fortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
  },
  insuranceFortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  oldestAge: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 18,
    max: 120,
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
  propertyWork: {
    // Additional work on property
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  usageType: {
    // primary, secondary or investment
    type: String,
    defaultValue: 'primary',
  },
  investmentRent: {
    // Rent of property if investment
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
  constructionYear: {
    type: Number,
    min: 0,
    max: 2030,
    optional: true,
  },
  renovationYear: {
    type: Number,
    min: 0,
    max: 2030,
    optional: true,
  },
  insideArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  landArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  balconyArea: {
    type: Number,
    optional: true,
    min: 0,
  },
  terraceArea: {
    type: Number,
    optional: true,
    min: 0,
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
  volumeNorm: {
    type: String,
    defaultValue: 'SIA',
  },
  parking: {
    type: Object,
    defaultValue: {},
  },
  'parking.box': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.inside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  'parking.outside': {
    type: Number,
    optional: true,
    min: 0,
    max: 100,
  },
  minergie: {
    type: Boolean,
    defaultValue: false,
  },
  isCoproperty: {
    type: Boolean,
    defaultValue: false,
  },
  copropertyPercentage: {
    type: Number,
    min: 0,
    max: 1,
    optional: true,
  },
  cityPlacementQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  buildingPlacementQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  buildingQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  flatQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
  },
  materialsQuality: {
    type: Number,
    min: 0,
    max: 5,
    optional: true,
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
  hasValidatedStructure: {
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
  lender: {
    type: String,
    optional: true,
  },
});
