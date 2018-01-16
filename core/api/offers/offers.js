import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { interestRates, cantons } from '../constants';

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
  interestLibor: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
  interest1: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
  interest2: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
  interest5: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
  interest10: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
  interest15: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
});

export const OfferSchema = new SimpleSchema({
  requestId: {
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
    allowedValues: Object.keys(cantons),
  },
  auctionEndTime: Date,
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
