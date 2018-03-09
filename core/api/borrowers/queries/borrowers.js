import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  firstName: 1,
  lastName: 1,
  createdAt: 1,
  updatedAt: 1,
});
