import { Match } from 'meteor/check';
import { adminContacts, contactSearch } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';

exposeQuery(adminContacts, {}, { allowFilterById: true });

exposeQuery(
  contactSearch,
  {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  {},
);
