import 'babel-polyfill';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Offers = new Mongo.Collection('offers');

Offers.allow({
  insert(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update(userId, doc) {
    // This is true if someone is logged in
    return !!userId && (userId === doc.userId);
  },
});


export const OfferSchema = new SimpleSchema({
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
  organization: {
    type: String,
    autoValue() {
      if (this.isInsert) {
        return Meteor.user().profile.organisation;
      }
    }
  },
  canton: {
    type: String,
    min: 2,
    max: 2,
  },
  requestId: {
    type: String,
    index: true,
  },
  standardOffer: {
    type: singleOffer,
    optional: true,
  },
  conditionsOffer: {
    type: singleOffer,
    optional: true,
  },
  conditions: {
    type: String,
    optional: true,
  }
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
    optional: true,
  },
  interestFloating: {
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
  interest7: {
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


// Attach schema
Offers.attachSchema(OfferSchema);
export default Offers;
