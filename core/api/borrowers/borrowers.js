import { createCollection } from '../helpers/collectionHelpers';
import { BORROWERS_COLLECTION } from './borrowerConstants';
import BorrowerSchema from './schemas/BorrowerSchema';

const Borrowers = createCollection(BORROWERS_COLLECTION, BorrowerSchema);

export default Borrowers;
