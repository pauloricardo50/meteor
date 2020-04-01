import InsuranceSchema from './schemas/InsuranceSchema';
import { INSURANCES_COLLECTION } from './insuranceConstants';

import { createCollection } from '../helpers/collectionHelpers';

const Insurances = createCollection(INSURANCES_COLLECTION);

Insurances.attachSchema(InsuranceSchema);
export default Insurances;
