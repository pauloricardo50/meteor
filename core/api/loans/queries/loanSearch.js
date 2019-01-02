import { adminLoans } from '../../fragments';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.LOAN_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(filters, createSearchFilters(['name', '_id'], searchQuery));
  },
  ...adminLoans(),
  $options: { sort: { createdAt: -1 } },
});
