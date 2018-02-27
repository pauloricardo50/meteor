import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { INTEREST_RATES, CANTONS } from '../constants';

const Offers = new Mongo.Collection('offers');

// Prevent all client side modifications of mongoDB
Offers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
Offers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

const singleOffer = new SimpleSchema({
  maxAmount: {
    type: Number,
    min: 0,
    max: 100000000,
  },
  amortization: {
    type: Number,
  },
  // For each existing rate, insert an allowed value in the schema
  ...Object.values(INTEREST_RATES).reduce(
    (object, interestKey) => ({
      ...object,
      [interestKey]: {
        type: Number,
        min: 0,
        max: 100,
        optional: true,
      },
    }),
    {},
  ),
});

export const OfferSchema = new SimpleSchema({
  loanId: {
    type: String,
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isInsert || this.isUpdate) {
        return new Date();
      }
    },
  },
  isAdmin: {
    type: Boolean,
    defaultValue: false,
  },
  organization: String,
  canton: {
    type: String,
    allowedValues: Object.keys(CANTONS),
  },
  auctionEndTime: {
    type: Date,
    optional: true,
  },
  standardOffer: {
    type: singleOffer,
  },
  counterpartOffer: {
    type: singleOffer,
    optional: true,
  },
  counterparts: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'counterparts.$': String,
  conditions: {
    type: Array,
    defaultValue: [],
  },
  'conditions.$': String,
});

// Attach schema
Offers.attachSchema(OfferSchema);
export default Offers;
