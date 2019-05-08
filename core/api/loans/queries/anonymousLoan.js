import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { userLoan } from '../../fragments';

export default Loans.createQuery(LOAN_QUERIES.ANONYMOUS_LOAN, userLoan(), {
  scoped: true,
});
