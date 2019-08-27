import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { adminBorrowers, borrowerSearch } from '../queries';

exposeQuery({
  query: adminBorrowers,
  options: { allowFilterById: true },
});

exposeQuery({
  query: borrowerSearch,
  overrides: { validateParams: { searchQuery: Match.Maybe(String) } },
});
