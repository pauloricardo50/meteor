import { Mongo } from 'meteor/mongo';

import InterestRatesSchema from './schemas/interestRatesSchema';
import { INTEREST_RATES_COLLECTION } from './interestRatesConstants';

const InterestRates = new Mongo.Collection(INTEREST_RATES_COLLECTION);

InterestRates.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

InterestRates.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

InterestRates.attachSchema(InterestRatesSchema);
export default InterestRates;
