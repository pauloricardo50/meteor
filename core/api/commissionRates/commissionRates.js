import CommissionRateSchema from './schemas/CommissionRateSchema';
import { COMMISSION_RATES_COLLECTION } from './commissionRateConstants';

import { createCollection } from '../helpers/collectionHelpers';

const CommissionRates = createCollection(COMMISSION_RATES_COLLECTION);

CommissionRates.attachSchema(CommissionRateSchema);
export default CommissionRates;
