import { Match } from 'meteor/check';

import { createSearchFilters } from '../../helpers/mongoHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { insuranceSearch } from '../queries';

exposeQuery({
  query: insuranceSearch,
  overrides: {
    firewall(userId) {
      SecurityService.checkUserIsAdmin(userId);
    },
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery, userId } }) => {
        const search = createSearchFilters(['name', '_id'], searchQuery);

        if (userId) {
          filters.$and = [search, { userId }];
        } else {
          Object.assign(filters, search);
        }
      };
    },
    validateParams: {
      searchQuery: Match.Maybe(String),
      userId: Match.Maybe(String),
    },
  },
});
