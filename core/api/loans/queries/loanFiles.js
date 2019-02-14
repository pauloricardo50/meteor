// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

export const loanFilesFragment = {
  documents: 1,
  borrowers: {
    documents: 1,
    $options: { sort: { createdAt: 1 } },
  },
  properties: {
    documents: 1,
    $options: { sort: { createdAt: 1 } },
  },
};

// Sort this query properly so that the merge on the client succeeds
export default Loans.createQuery(LOAN_QUERIES.LOAN_FILES, {
  $filter({ filters, params: { loanId, loanIds } }) {
    if (loanId) {
      filters._id = loanId;
    }
    if (loanIds) {
      filters._id = { $in: loanIds };
    }
    if (loanId && loanIds) {
      throw new Error(
        'invalid query params',
        `Can't ask for both loanId "${loanId}" and loanIds "${loanIds}" in loanFiles query`,
      );
    }
  },
  ...loanFilesFragment,
});
