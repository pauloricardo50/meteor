import { createCollection } from '../helpers/collectionHelpers';
import { COMMISSION_RATES_COLLECTION } from './commissionRateConstants';
import CommissionRateSchema from './schemas/CommissionRateSchema';

const CommissionRates = createCollection(
  COMMISSION_RATES_COLLECTION,
  CommissionRateSchema,
);

export default CommissionRates;
