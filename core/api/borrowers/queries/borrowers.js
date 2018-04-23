import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import {
  createRegexQuery,
  createSearchFilters,
} from '../../helpers/mongoHelpers';

export default Borrowers.createQuery(BORROWER_QUERIES.ADMIN_BORROWERS, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      // the following implementation commented out will return any doc
      // containing at least one of the searched words, thus too many
      // irrelevant results.
      //
      // const formatedSearchQuery = searchQuery.split(' ').join('|');
      //
      // filters.$or = [
      //   createRegexQuery('firstName', formatedSearchQuery),
      //   createRegexQuery('lastName', formatedSearchQuery),
      // ];

      // the following method forces one word to be found in lastname field
      // and one word in firstName field, but doesn't work if you only fill in
      // firstName or lastName with multiple words.
      // Ex. searching for "marie" will display all maries(correct),
      // searching for "marie babel" will display correct results, so will
      // "marie anne babel", but for "marie anne" you will not receive any
      // result

      if (searchQuery.indexOf(' ') > -1) {
        const formatedSearchQuery = searchQuery.split(' ').join('|');

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
