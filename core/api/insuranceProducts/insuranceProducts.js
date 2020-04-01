import InsuranceProductSchema from './schemas/InsuranceProductSchema';
import { INSURANCE_PRODUCTS_COLLECTION } from './insuranceProductConstants';

import { createCollection } from '../helpers/collectionHelpers';

const InsuranceProducts = createCollection(INSURANCE_PRODUCTS_COLLECTION);

InsuranceProducts.attachSchema(InsuranceProductSchema);
export default InsuranceProducts;
