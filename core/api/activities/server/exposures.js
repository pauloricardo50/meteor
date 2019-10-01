import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { adminActivities } from '../queries';

exposeQuery({
  query: adminActivities,
  overrides: {
    embody: (body) => {
      body.$filter = ({ filters, params: { _id, loanId, type, userId } }) => {
        if (_id) {
          filters._id = _id;
        }

        if (loanId) {
          filters['loanLink._id'] = loanId;
        }

        if (userId) {
          filters['userLink._id'] = userId;
        }

        if (type) {
          filters.type = type;
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      loanId: Match.Maybe(String),
      userId: Match.Maybe(String),
      type: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
});
