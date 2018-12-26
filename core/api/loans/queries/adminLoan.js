import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import adminLoanFragment from './loanFragments/adminLoanFragment';

export default Loans.createQuery(LOAN_QUERIES.ADMIN_LOAN, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  ...adminLoanFragment,
});
