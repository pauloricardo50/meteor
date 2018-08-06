// @flow
import SimpleSchema from 'simpl-schema';
import {
  PURCHASE_TYPE,
  OWNER,
  CANTONS,
  AUCTION_MOST_IMPORTANT,
  GENDER,
  USAGE_TYPE,
} from '../../constants';

const GeneralSchema = new SimpleSchema({
  purchaseType: {
    type: String,
    defaultValue: PURCHASE_TYPE.ACQUISITION,
    allowedValues: Object.values(PURCHASE_TYPE),
  },
  usageType: {
    type: String,
    defaultValue: USAGE_TYPE.PRIMARY,
    allowedValues: Object.values(USAGE_TYPE),
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
  partnersToAvoid: {
    type: Array,
    defaultValue: [],
  },
  'partnersToAvoid.$': String,
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
});

export default GeneralSchema;
