import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import { adminLoan } from '../../fragments';
import { formatLoanWithDocuments } from '../../../utils/loanFunctions';

// This query can be used on the server to get a complete loan, just like on the client
export default Loans.createQuery(LOAN_QUERIES.FULL_LOAN, {
  $filter({ filters, params }) {
    filters._id = params.loanId;
  },
  $postFilter(loans = []) {
    return loans.map(formatLoanWithDocuments);
  },
  ...adminLoan({ withSort: true }),
});
