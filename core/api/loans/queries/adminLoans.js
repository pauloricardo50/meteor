import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { adminLoansFragment } from './loanFragments';

export default Loans.createQuery(LOAN_QUERIES.ADMIN_LOANS, {
  $filter({ filters, params: { searchQuery, step, owned } }) {
    if (searchQuery) {
      Object.assign(filters, createSearchFilters(['name'], searchQuery));
    }

    if (step) {
      filters['logic.step'] = step;
    }

    if (owned) {
      filters.userId = { $exists: true };
    }
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  ...adminLoansFragment,
});
