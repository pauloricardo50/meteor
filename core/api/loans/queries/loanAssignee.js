import Loans from '..';
import { LOANS_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOANS_QUERIES.ASSIGNED_TO, {
  $filter({ filters, params }) {
    filters.assignedTo = params.userId;
  },
  assignedTo: 1,
});
