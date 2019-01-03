import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { sideNavBorrower } from '../../fragments';

export default Borrowers.createQuery(BORROWER_QUERIES.SIDENAV_BORROWERS, {
  $paginate: true,
  ...sideNavBorrower(),
  $options: { sort: { createdAt: -1 } },
});
