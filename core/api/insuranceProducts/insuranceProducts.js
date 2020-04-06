import { createCollection } from '../helpers/collectionHelpers';
import { INSURANCE_PRODUCTS_COLLECTION } from './insuranceProductConstants';
import InsuranceProductSchema from './schemas/InsuranceProductSchema';

const InsuranceProducts = createCollection(
  INSURANCE_PRODUCTS_COLLECTION,
  InsuranceProductSchema,
);

export default InsuranceProducts;
