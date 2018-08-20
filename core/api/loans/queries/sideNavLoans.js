import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { sideNavLoanFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.SIDENAV_LOANS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $paginate: true,
  ...sideNavLoanFragment,
});
