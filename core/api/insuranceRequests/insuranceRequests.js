import InsuranceSchema from './schemas/InsuranceRequestSchema';
import { INSURANCE_REQUESTS_COLLECTION } from './insuranceRequestConstants';
import { createCollection } from '../helpers/collectionHelpers';

const InsuranceRequests = createCollection(INSURANCE_REQUESTS_COLLECTION);

InsuranceRequests.attachSchema(InsuranceSchema);
export default InsuranceRequests;
