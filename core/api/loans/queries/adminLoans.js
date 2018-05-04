import _ from 'lodash';
import Loans from '..';
import { LOAN_QUERIES } from '../loanConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';

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
  name: 1,
  logic: 1,
  general: 1,
  createdAt: 1,
  updatedAt: 1,
  property: {
    value: 1,
  },
  borrowers: {
    firstName: 1,
  },
});
