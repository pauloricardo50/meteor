import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { proLoans } from '../../fragments';

export default Loans.createQuery(LOAN_QUERIES.ORGANISATION_LOANS, {
  ...proLoans(),
});
