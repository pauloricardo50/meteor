import { createCollection } from '../helpers/collectionHelpers';
import { INTEREST_RATES_COLLECTION } from './interestRatesConstants';
import InterestRatesSchema from './schemas/interestRatesSchema';

const InterestRates = createCollection(INTEREST_RATES_COLLECTION);

InterestRates.attachSchema(InterestRatesSchema);
export default InterestRates;
