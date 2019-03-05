// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.PRO_REFERRED_BY_LOANS, () => {});
