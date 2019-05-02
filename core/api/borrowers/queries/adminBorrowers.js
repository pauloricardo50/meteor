import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { adminBorrower } from '../../fragments';

export default Borrowers.createQuery(
  BORROWER_QUERIES.ADMIN_BORROWERS,
  adminBorrower(),
);
