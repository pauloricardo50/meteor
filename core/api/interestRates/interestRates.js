import InterestRatesSchema from './schemas/interestRatesSchema';
import { INTEREST_RATES_COLLECTION } from './interestRatesConstants';
import { createCollection } from '../helpers/collectionHelpers';

const InterestRates = createCollection(INTEREST_RATES_COLLECTION);

InterestRates.attachSchema(InterestRatesSchema);
export default InterestRates;
