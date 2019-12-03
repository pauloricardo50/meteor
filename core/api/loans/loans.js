import LoanSchema from './schemas/LoanSchema';
import { LOANS_COLLECTION } from './loanConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Loans = createCollection(LOANS_COLLECTION);

Loans.attachSchema(LoanSchema);
export default Loans;
