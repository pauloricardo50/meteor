import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { adminLoansFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.LOAN_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(filters, createSearchFilters(['name', '_id'], searchQuery));
  },
  ...adminLoansFragment,
  $options: { sort: { createdAt: -1 } },
});
