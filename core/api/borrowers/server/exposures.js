import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { adminBorrowers, borrowerSearch } from '../queries';

exposeQuery(adminBorrowers, {}, { allowFilterById: true });

exposeQuery(
  borrowerSearch,
  { validateParams: { searchQuery: Match.Maybe(String) } },
  {},
);
