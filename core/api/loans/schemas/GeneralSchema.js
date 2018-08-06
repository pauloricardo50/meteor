// @flow
import SimpleSchema from 'simpl-schema';
import {
  PURCHASE_TYPE,
  OWNER,
  CANTONS,
  AUCTION_MOST_IMPORTANT,
  GENDER,
  RESIDENCE_TYPE,
} from '../../constants';
import { loanTranchesSchema } from './otherSchemas';

const GeneralSchema = new SimpleSchema({
  purchaseType: {
    type: String,
    defaultValue: PURCHASE_TYPE.ACQUISITION,
    allowedValues: Object.values(PURCHASE_TYPE),
  },
  usageType: {
    type: String,
    defaultValue: RESIDENCE_TYPE.MAIN,
    allowedValues: Object.values(RESIDENCE_TYPE),
  },
  fortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  insuranceFortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  propertyWork: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  oldestAge: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 18,
    max: 120,
  },
  oldestGender: {
    type: String,
    optional: true,
    allowedValues: Object.values(GENDER),
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
    allowedValues: Object.keys(CANTONS),
  },
  currentOwner: {
    type: String,
    defaultValue: OWNER.FIRST,
    allowedValues: Object.values(OWNER),
  },
  futureOwner: {
    type: String,
    defaultValue: OWNER.FIRST,
    allowedValues: Object.values(OWNER),
  },
  otherOwner: {
    type: String,
    optional: true,
  },
  wantedClosingDate: {
    type: Date,
    optional: true,
  },
  auctionMostImportant: {
    type: String,
    optional: true,
    allowedValues: Object.values(AUCTION_MOST_IMPORTANT),
  },
  ...loanTranchesSchema,
});

export default GeneralSchema;
