import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import { adminLoanFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.ADMIN_LOAN, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $postFilter(loans) {
    return loans.map(formatLoanWithStructure);
  },
  ...adminLoanFragment,
});
