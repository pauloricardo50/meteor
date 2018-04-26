import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../../helpers/mongoHelpers';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      // TODO: refine borrower's search, detailes on github
      // https://github.com/e-Potek/epotek/pull/119

      // the following method forces one word to be found in lastname field
      // and one word in firstName field.
      searchQuery = searchQuery.trim();

      if (searchQuery.indexOf(' ') > -1) {
        const formatedSearchQuery = generateMatchAnyWordRegexp(searchQuery);

        filters.$and = [
          createRegexQuery('firstName', formatedSearchQuery),
          createRegexQuery('lastName', formatedSearchQuery),
        ];
      } else {
        filters.$or = [
          createRegexQuery('firstName', searchQuery),
          createRegexQuery('lastName', searchQuery),
        ];
      }
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
