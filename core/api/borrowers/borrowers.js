import { BORROWERS_COLLECTION } from './borrowerConstants';
import BorrowerSchema from './schemas/BorrowerSchema';
import { createCollection } from '../helpers/collectionHelpers';

const Borrowers = createCollection(BORROWERS_COLLECTION);

Borrowers.attachSchema(BorrowerSchema);
export default Borrowers;
