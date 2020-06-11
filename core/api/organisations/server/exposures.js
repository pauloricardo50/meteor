import { Match } from 'meteor/check';

import { createSearchFilters } from '../../helpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { organisationSearch, proOrganisation } from '../queries';

exposeQuery({
  query: organisationSearch,
  overrides: {
    firewall: () => {
      SecurityService.checkCurrentUserIsAdmin();
    },
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
        Object.assign(
          filters,
          createSearchFilters(['name', '_id', 'type'], searchQuery),
        );
      };
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});

exposeQuery({
  query: proOrganisation,
  overrides: {
    firewall: userId => {
      SecurityService.checkUserIsPro(userId);
    },
    validateParams: { organisationId: String, $body: Match.Maybe(Object) },
    embody: body => {
      body.$filter = ({ filters, params: { organisationId } }) => {
        filters._id = organisationId;
      };
    },
  },
});
