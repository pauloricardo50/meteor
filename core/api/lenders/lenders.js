import LenderSchema from './schemas/lenderSchema';
import { LENDERS_COLLECTION } from './lenderConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Lenders = createCollection(LENDERS_COLLECTION);

Lenders.attachSchema(LenderSchema);
export default Lenders;
