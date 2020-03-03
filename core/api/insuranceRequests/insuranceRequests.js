import InsuranceSchema from './schemas/InsuranceRequestSchema';
import { INSURANCE_REQUESTS_COLLECTION } from './insuranceRequestConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Insurances = createCollection(INSURANCE_REQUESTS_COLLECTION);

Insurances.attachSchema(InsuranceSchema);
export default Insurances;
