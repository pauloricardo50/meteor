import Loans from '..';
import { LOAN_QUERIES } from '../loanConstants';

export default Loans.createQuery(LOAN_QUERIES.ADMIN_LOANS, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      filters.name = { $regex: searchQuery };
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
