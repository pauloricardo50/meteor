// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

// Sort this query properly so that the merge on the client succeeds
export default Loans.createQuery(LOAN_QUERIES.PRO_REFERRED_BY_LOANS, () => {});
