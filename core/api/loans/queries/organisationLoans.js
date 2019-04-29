import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { proLoans, fullRevenues } from '../../fragments';

export default Loans.createQuery(LOAN_QUERIES.ORGANISATION_LOANS, {
  ...proLoans(),
  revenues: fullRevenues(),
});
