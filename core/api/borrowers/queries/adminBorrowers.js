import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { baseBorrower } from '../../fragments';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  ...baseBorrower(),
  loans: { name: 1 },
  user: { name: 1 },
  $options: { sort: { createdAt: -1 } },
});
