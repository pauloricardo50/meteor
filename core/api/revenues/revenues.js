import RevenueSchema from './schemas/revenueSchema';
import { REVENUES_COLLECTION } from './revenueConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Revenues = createCollection(REVENUES_COLLECTION);

Revenues.attachSchema(RevenueSchema);
export default Revenues;
