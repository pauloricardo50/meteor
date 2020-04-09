import { createCollection } from '../helpers/collectionHelpers';
import { REVENUES_COLLECTION } from './revenueConstants';
import RevenueSchema from './schemas/revenueSchema';

const Revenues = createCollection(REVENUES_COLLECTION);

Revenues.attachSchema(RevenueSchema);
export default Revenues;
