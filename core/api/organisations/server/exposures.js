import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { createSearchFilters } from '../../helpers';
import SecurityService from '../../security';
import {
  adminOrganisations,
  organisationSearch,
  proOrganisation,
  userOrganisations,
} from '../queries';
import { ORGANISATION_FEATURES } from '../organisationConstants';

const makeFilter = ({ param, field, filters }) => {
  if (param && !(Array.isArray(param) && !param.length)) {
    filters[field] = { $in: Array.isArray(param) ? param : [param] };
  }
};

exposeQuery({
  query: adminOrganisations,
  overrides: {
    validateParams: {
      features: Match.Maybe(Match.OneOf(String, [String])),
      tags: Match.Maybe(Match.OneOf(String, [String])),
      type: Match.Maybe(Match.OneOf(String, [String])),
      hasRules: Match.Maybe(Boolean),
    },
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: { features, tags, type, _id, hasRules },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (hasRules) {
          filters.features = ORGANISATION_FEATURES.LENDER;
          filters.lenderRulesCount = { $gte: 1 };
        }

        makeFilter({ param: features, field: 'features', filters });
        makeFilter({ param: tags, field: 'tags', filters });
        makeFilter({ param: type, field: 'type', filters });
      };
      body.$options = { sort: { name: 1 } };
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: organisationSearch,
  overrides: {
    firewall: () => {
      SecurityService.checkCurrentUserIsAdmin();
    },
    embody: (body) => {
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
    firewall: (userId) => {
      SecurityService.checkUserIsPro(userId);
    },
    validateParams: { organisationId: String, $body: Match.Maybe(Object) },
    embody: (body) => {
      body.$filter = ({ filters, params: { organisationId } }) => {
        filters._id = organisationId;
      };
    },
  },
});

exposeQuery({
  query: userOrganisations,
  overrides: {
    firewall: (userId) => {
      SecurityService.checkUserLoggedIn(userId);
    },
    embody: (body) => {
      body.$filter = ({ filters }) => {
        filters.features = { $in: [ORGANISATION_FEATURES.LENDER] };
      };
    },
    validateParams: {},
  },
});
