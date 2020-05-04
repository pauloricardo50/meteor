import { createCollection } from '../helpers/collectionHelpers';
import { INSURANCES_COLLECTION } from './insuranceConstants';
import InsuranceSchema from './schemas/InsuranceSchema';

const Insurances = createCollection(INSURANCES_COLLECTION, InsuranceSchema);

export default Insurances;
