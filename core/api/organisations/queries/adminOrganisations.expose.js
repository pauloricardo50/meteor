import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './adminOrganisations';

const makeFilter = ({ param, field, filters }) => {
  if (param && !(Array.isArray(param) && !param.length)) {
    filters[field] = { $in: Array.isArray(param) ? param : [param] };
  }
};

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
  validateParams: {
    features: Match.Maybe(Match.OneOf(String, [String])),
    tags: Match.Maybe(Match.OneOf(String, [String])),
    type: Match.Maybe(Match.OneOf(String, [String])),
    name: Match.Maybe(String),
    $body: Match.Maybe(Object),
  },
  embody: {
    $filter({ filters, params: { features, tags, type } }) {
      makeFilter({ param: features, field: 'features', filters });
      makeFilter({ param: tags, field: 'tags', filters });
      makeFilter({ param: type, field: 'type', filters });
    },
    $options: { sort: { name: 1 } },
  },
});
