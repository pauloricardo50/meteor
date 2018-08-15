import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import { sideNavLoanFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.SIDENAV_LOANS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $postFilter: loans => loans.map(formatLoanWithStructure),
  $paginate: true,
  ...sideNavLoanFragment,
});
