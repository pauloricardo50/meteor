import { Match } from 'meteor/check';

import SecurityService from '../../security';
import { exposeQuery } from '../../queries/queryHelpers';
import {
  adminOrganisations,
  organisationSearch,
  proOrganisation,
  userOrganisations,
} from '../queries';

const makeFilter = ({ param, field, filters }) => {
  if (param && !(Array.isArray(param) && !param.length)) {
    filters[field] = { $in: Array.isArray(param) ? param : [param] };
  }
};

exposeQuery(
  adminOrganisations,
  {
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
          filters.lenderRulesCount = { $gte: 1 };
        }

        makeFilter({ param: features, field: 'features', filters });
        makeFilter({ param: tags, field: 'tags', filters });
        makeFilter({ param: type, field: 'type', filters });
      };
      body.$options = { sort: { name: 1 } };
    },
  },
  { allowFilterById: true },
);

exposeQuery(
  organisationSearch,
  {
    firewall: () => {
      SecurityService.checkCurrentUserIsAdmin();
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  {},
);

exposeQuery(
  proOrganisation,
  {
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
  {},
);

exposeQuery(
  userOrganisations,
  {
    firewall: (userId) => {
      SecurityService.checkUserLoggedIn(userId);
    },
    validateParams: {},
  },
  {},
);
