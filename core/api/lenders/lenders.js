import { createCollection } from '../helpers/collectionHelpers';
import { LENDERS_COLLECTION } from './lenderConstants';
import LenderSchema from './schemas/lenderSchema';

const Lenders = createCollection(LENDERS_COLLECTION, LenderSchema);

export default Lenders;
