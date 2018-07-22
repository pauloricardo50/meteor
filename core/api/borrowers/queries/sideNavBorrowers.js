import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';

export default Borrowers.createQuery(BORROWER_QUERIES.SIDENAV_BORROWERS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  firstName: 1,
  lastName: 1,
  createdAt: 1,
  updatedAt: 1,
  user: {
    assignedEmployee: { emails: 1 },
  },
});
