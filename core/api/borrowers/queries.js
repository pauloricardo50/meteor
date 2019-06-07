import Borrowers from '.';
import { adminBorrower } from '../fragments';
import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../helpers/mongoHelpers';
import { BORROWER_QUERIES } from './borrowerConstants';

export const adminBorrowers = Borrowers.createQuery(
  BORROWER_QUERIES.ADMIN_BORROWERS,
  adminBorrower(),
);

export const borrowerSearch = Borrowers.createQuery(
  BORROWER_QUERIES.BORROWER_SEARCH,
  {
    $filter({ filters, params: { searchQuery } }) {
      // the following method forces one word to be found in lastname field
      // and one word in firstName field.
      const formattedSearchQuery = generateMatchAnyWordRegexp(searchQuery);

      filters.$or = [
        createRegexQuery('_id', searchQuery),
        createRegexQuery('firstName', searchQuery),
        createRegexQuery('lastName', searchQuery),
        {
          $and: [
            createRegexQuery('firstName', formattedSearchQuery),
            createRegexQuery('lastName', formattedSearchQuery),
          ],
        },
      ];
    },
    name: 1,
    createdAt: 1,
    updatedAt: 1,
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);
