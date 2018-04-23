import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import {
  createRegexQuery,
  createSearchFilters,
} from '../../helpers/mongoHelpers';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      // filters = createSearchFilters(['firstName', 'lastName'], searchQuery);
      if (searchQuery.indexOf(' ') > -1) {
        searchQuery = searchQuery.replace(' ', '|');
        filters.$and = [
          createRegexQuery('firstName', searchQuery),
          createRegexQuery('lastName', searchQuery),
        ];
      } else {
        filters.$or = [
          createRegexQuery('firstName', searchQuery),
          createRegexQuery('lastName', searchQuery),
        ];
      }
      console.log('borrower filters ', filters.$or);
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
