import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { createRegexQuery } from '../../helpers/mongoHelpers';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      filters.$or = [
        createRegexQuery('firstName', searchQuery),
        createRegexQuery('lastName', searchQuery),
      ];
    }
  },
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  firstName: 1,
  lastName: 1,
  createdAt: 1,
  updatedAt: 1,
});
