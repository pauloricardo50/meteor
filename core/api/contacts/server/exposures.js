import { Match } from 'meteor/check';
import { adminContacts, contactSearch } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';

exposeQuery({ query: adminContacts, options: { allowFilterById: true } });

exposeQuery({
  query: contactSearch,
  overrides: {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});
