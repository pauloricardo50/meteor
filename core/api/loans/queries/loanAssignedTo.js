import Loans from '..';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.LOANS_ASSIGNED_TO, {
  $filter({ filters, params }) {
    filters._id = params.loanId;
  },
  user: {
    assignedEmployeeId: 1,
  },
});
