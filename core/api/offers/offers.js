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
  createdAt,
  updatedAt,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
  contactLink: { type: Object, optional: true },
  'contactLink._id': String,
  'contactLink.feedback': { type: String, optional: true },
  maxAmount: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
  },
  amortizationGoal: {
    type: Number,
    min: 0,
    max: 1,
  },
  amortizationYears: {
    type: Number,
    min: 0,
    max: 100,
    optional: true,
  },
  fees: {
    type: Number,
    min: 0,
    max: 1000000000,
    defaultValue: 0,
  },
  epotekFees: {
    type: Number,
    min: 0,
    max: 1000000000,
    defaultValue: 0,
  },
  // For each existing rate, insert an allowed value in the schema
  ...Object.values(INTEREST_RATES).reduce(
    (accumulator, interestKey) => ({
      ...accumulator,
      [interestKey]: {
        type: Number,
        min: 0,
        max: 1,
        optional: true,
      },
    }),
    {},
  ),
  conditions: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'conditions.$': { type: String, optional: true },
  lenderLink: { type: Object, optional: true },
  'lenderLink._id': { type: String, optional: true },
  feedback: { type: String, optional: true },
});

// Attach schema
Offers.attachSchema(OfferSchema);
export default Offers;
