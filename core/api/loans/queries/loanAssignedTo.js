import Loans from '..';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.ASSIGNED_TO, {
  $filter({ filters, params }) {
    filters._id = params.loanId;
  },
  user: {
    assignedTo: 1,
  },
});
