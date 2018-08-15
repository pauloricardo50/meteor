import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { sideNavBorrowerFragment } from './borrowerFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.SIDENAV_BORROWERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  ...sideNavBorrowerFragment,
});
