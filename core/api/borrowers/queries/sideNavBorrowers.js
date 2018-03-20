import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';

export default Borrowers.createQuery(BORROWER_QUERIES.SIDENAV_BORROWERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  // extra fields example
  // firstName: 1,
  // lastName: 1,
});
