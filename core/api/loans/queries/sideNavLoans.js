import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { sideNavLoanFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.SIDENAV_LOANS, {
  $paginate: true,
  ...sideNavLoanFragment,
  $options: { sort: { createdAt: -1 } },
});
