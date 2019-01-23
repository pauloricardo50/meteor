// @flow
import { proLoans } from '../../fragments';
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

// Sort this query properly so that the merge on the client succeeds
export default Loans.createQuery(LOAN_QUERIES.PRO_LOANS, {
  $filter({ filters, params: { promotionId } }) {
    filters['promotionLinks._id'] = promotionId;
  },
  ...proLoans(),
});
