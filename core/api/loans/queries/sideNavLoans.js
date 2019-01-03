import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { sideNavLoan } from '../../fragments';

export default Loans.createQuery(LOAN_QUERIES.SIDENAV_LOANS, {
  $paginate: true,
  ...sideNavLoan(),
  $options: { sort: { createdAt: -1 } },
});
