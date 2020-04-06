import { createCollection } from '../helpers/collectionHelpers';
import { INSURANCE_REQUESTS_COLLECTION } from './insuranceRequestConstants';
import InsuranceRequestSchema from './schemas/InsuranceRequestSchema';

const InsuranceRequests = createCollection(
  INSURANCE_REQUESTS_COLLECTION,
  InsuranceRequestSchema,
);

export default InsuranceRequests;
