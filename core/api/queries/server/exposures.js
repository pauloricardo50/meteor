import { Match } from 'meteor/check';

import { searchDatabase } from '../queries';
import { exposeQuery } from '../queryHelpers';
import { searchDatabaseResolver } from './resolvers';

exposeQuery({
  query: searchDatabase,
  overrides: {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  resolver: searchDatabaseResolver,
  cacher: { ttl: 20 * 1000 },
});
