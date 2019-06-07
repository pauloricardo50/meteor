import { Match } from 'meteor/check';
import { exposeQuery } from '../../queries/queryHelpers';
import { adminContacts, contactSearch } from '../queries';

exposeQuery({ query: adminContacts, options: { allowFilterById: true } });

exposeQuery({
  query: contactSearch,
  overrides: { validateParams: { searchQuery: Match.Maybe(String) } },
});
