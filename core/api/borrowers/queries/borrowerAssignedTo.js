import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';

export default Borrowers.createQuery(BORROWER_QUERIES.BORROWER_ASSIGNED_TO, {
  $filter({ filters, params }) {
    filters.userId = params.userId;
  },
  assignedTo: 1,
});
