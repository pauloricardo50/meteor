import { createCollection } from '../helpers/collectionHelpers';
import { LENDERS_COLLECTION } from './lenderConstants';
import LenderSchema from './schemas/lenderSchema';

const Lenders = createCollection(LENDERS_COLLECTION);

Lenders.attachSchema(LenderSchema);
export default Lenders;
