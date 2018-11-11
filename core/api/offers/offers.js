import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { INTEREST_RATES, OFFERS_COLLECTION } from '../constants';
import { createdAt, updatedAt } from '../helpers/sharedSchemas';

const Offers = new Mongo.Collection(OFFERS_COLLECTION);

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

export const OfferSchema = new SimpleSchema({
  loanId: {
    type: String,
  },
  userId: {
    type: String,
    optional: true,
  },
  createdAt,
  updatedAt,
  organisation: String,
  maxAmount: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
  },
  amortization: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 1000000,
  },
  // For each existing rate, insert an allowed value in the schema
  ...Object.values(INTEREST_RATES).reduce(
    (accumulator, interestKey) => ({
      ...accumulator,
      [interestKey]: {
        type: Number,
        min: 0,
        max: 100,
        optional: true,
      },
    }),
    {},
  ),
  conditions: {
    type: Array,
    optional: true,
  },
  'conditions.$': String,
});

// Attach schema
Offers.attachSchema(OfferSchema);
export default Offers;
