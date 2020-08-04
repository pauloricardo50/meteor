import { createCollection } from '../helpers/collectionHelpers';
import { LOANS_COLLECTION } from './loanConstants';
import LoanSchema from './schemas/LoanSchema';

const Loans = createCollection(LOANS_COLLECTION, LoanSchema);

export default Loans;
