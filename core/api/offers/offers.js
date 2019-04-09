import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { INTEREST_RATES, OFFERS_COLLECTION } from '../constants';
import {
  createdAt,
  updatedAt,
  percentageField,
  moneyField,
} from '../helpers/sharedSchemas';

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
  maxAmount: moneyField,
  amortizationGoal: percentageField,
  amortizationYears: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100,
    optional: true,
  },
  fees: moneyField,
  epotekFees: moneyField,
  // For each existing rate, insert an allowed value in the schema
  ...Object.values(INTEREST_RATES).reduce(
    (accumulator, interestKey) => ({
      ...accumulator,
      [interestKey]: percentageField,
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
  feedback: { type: Object, optional: true },
  'feedback.message': { type: String, optional: true },
  'feedback.date': { type: Date, optional: true },
  withCounterparts: { type: Boolean, optional: true },
  enableOffer: { type: Boolean, defaultValue: true, optional: true },
  lenderCache: {
    type: Object,
    blackbox: true,
    optional: true,
  },
});

export const AdminOfferSchema = OfferSchema.omit(
  'lenderLink',
  'organisationLink',
  'contactLink',
  'createdAt',
  'updatedAt',
  'feedback',
  'lenderCache',
);

// Attach schema
Offers.attachSchema(OfferSchema);
export default Offers;
