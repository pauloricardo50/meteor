import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { adminLoans } from '../../fragments';

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
  ...adminLoans({ withSort: true }),
  $options: { sort: { createdAt: -1 } },
});
