import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { baseBorrowerFragment } from './borrowerFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  ...baseBorrowerFragment,
  loans: { name: 1 },
  user: { name: 1 },
  $options: { sort: { createdAt: -1 } },
});
