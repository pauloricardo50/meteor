import { Match } from 'meteor/check';
import { exposeQuery } from '../../queries/queryHelpers';
import {
  generateMatchAnyWordRegexp,
  createRegexQuery,
} from '../../helpers/mongoHelpers';
import { adminContacts, contactSearch } from '../queries';

exposeQuery({ query: adminContacts, options: { allowFilterById: true } });

exposeQuery({
  query: contactSearch,
  overrides: {
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
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
