import { Match } from 'meteor/check';

import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../../helpers/mongoHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import { adminBorrowers, borrowerSearch } from '../queries';

exposeQuery({
  query: adminBorrowers,
  options: { allowFilterById: true },
});

exposeQuery({
  query: borrowerSearch,
  overrides: {
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery, userId } }) => {
        // the following method forces one word to be found in lastname field
        // and one word in firstName field.
        const formattedSearchQuery = generateMatchAnyWordRegexp(searchQuery);
        const search = [
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

        if (userId) {
          filters.$and = [{ userId }, { $or: search }];
        } else {
          filters.$or = search;
        }
      };
    },
    validateParams: {
      searchQuery: Match.Maybe(String),
      userId: Match.Maybe(String),
    },
  },
});
