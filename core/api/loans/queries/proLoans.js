// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { proLoansFragment } from './loanFragments';

// Sort this query properly so that the merge on the client succeeds
export default Loans.createQuery(LOAN_QUERIES.PRO_LOANS, {
  $filter({ filters, params: { promotionId } }) {
    filters['promotionLinks._id'] = promotionId;
  },
  ...proLoansFragment,
});
