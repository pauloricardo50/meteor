// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';

// Sort this query properly so that the merge on the client succeeds
export default Loans.createQuery(LOAN_QUERIES.LOAN_FILES, {
  $filter({ filters, params: { loanId } }) {
    filters._id = loanId;
  },
  documents: 1,
  borrowers: {
    documents: 1,
    $options: { sort: { createdAt: 1 } },
  },
  properties: {
    documents: 1,
    $options: { sort: { createdAt: 1 } },
  },
});
