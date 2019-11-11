import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../../helpers/mongoHelpers';
import { adminBorrowers, borrowerSearch } from '../queries';

exposeQuery({
  query: adminBorrowers,
  options: { allowFilterById: true },
});

exposeQuery({
  query: borrowerSearch,
  overrides: {
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
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
      };
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});
