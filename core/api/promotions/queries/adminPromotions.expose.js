import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminPromotions';

exposeQuery(query, {
  embody: {
    $filter({ filters, params: { _id, hasTimeline } }) {
      if (_id) {
        filters._id = _id;
      }

      if (hasTimeline) {
        filters['constructionTimeline.1'] = { $exists: true };
      }
    },
  },
  validateParams: {
    _id: Match.Maybe(String),
    hasTimeline: Match.Maybe(Boolean),
  },
});
