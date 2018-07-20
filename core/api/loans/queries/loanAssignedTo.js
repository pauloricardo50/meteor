import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.LOANS_ASSIGNED_TO, {
  $filter({ filters, params: { loanId } }) {
    filters._id = loanId;
  },
  userId: 1,
  createdAt: 1,
});
