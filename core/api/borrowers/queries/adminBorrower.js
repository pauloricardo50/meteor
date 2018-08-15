import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import { adminBorrowerFragment } from './borrowerFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.BORROWER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $postFilter(borrowers) {
    return borrowers.map(({ loans, ...borrower }) => ({
      ...borrower,
      loans: loans.map(formatLoanWithStructure),
    }));
  },
  ...adminBorrowerFragment,
});
