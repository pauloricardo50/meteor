import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { baseBorrowerFragment } from './borrowerFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  ...baseBorrowerFragment,
  $options: { sort: { createdAt: -1 } },
});
