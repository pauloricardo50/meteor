import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { sideNavBorrowerFragment } from './borrowerFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.SIDENAV_BORROWERS, {
  $paginate: true,
  ...sideNavBorrowerFragment,
  $options: { sort: { createdAt: -1 } },
});
