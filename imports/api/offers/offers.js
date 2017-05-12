import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Offers = new Mongo.Collection('offers');

Offers.allow({
  insert(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update(userId, doc) {
    // This is true if someone is logged in and ownership is correct
    return !!userId && userId === doc.userId;
  },
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
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    },
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
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
      return undefined;
    },
  },
  isAdmin: {
    type: Boolean,
    defaultValue: false,
  },
  organization: String,
  canton: {
    type: String,
    min: 2,
    max: 2,
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
