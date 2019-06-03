import { createSearchFilters } from '../../helpers/mongoHelpers';
import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.LOAN_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(
      filters,
      createSearchFilters(['name', '_id', 'customName'], searchQuery),
    );
  },
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  step: 1,
  $options: { sort: { createdAt: -1 }, limit: 5 },
});
