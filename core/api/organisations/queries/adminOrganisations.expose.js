import { Match } from 'meteor/check';

import { exposeQuery } from 'core/api/queries/queryHelpers';
import query from './adminOrganisations';

const makeFilter = ({ param, field, filters }) => {
  if (param && !(Array.isArray(param) && !param.length)) {
    filters[field] = { $in: Array.isArray(param) ? param : [param] };
  }
};

exposeQuery(
  query,
  {
    validateParams: {
      features: Match.Maybe(Match.OneOf(String, [String])),
      tags: Match.Maybe(Match.OneOf(String, [String])),
      type: Match.Maybe(Match.OneOf(String, [String])),
      // _id: Match.Maybe(String),
      hasRules: Match.Maybe(Boolean),
    },
    embody: {
      $filter({ filters, params: { features, tags, type, _id, hasRules } }) {
        if (_id) {
          filters._id = _id;
        }

        if (hasRules) {
          filters.lenderRulesCount = { $gte: 1 };
        }

        makeFilter({ param: features, field: 'features', filters });
        makeFilter({ param: tags, field: 'tags', filters });
        makeFilter({ param: type, field: 'type', filters });
      },
      $options: { sort: { name: 1 } },
    },
  },
  { allowFilterById: true },
);
