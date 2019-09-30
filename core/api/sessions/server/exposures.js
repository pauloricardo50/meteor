import { Meteor } from 'meteor/meteor';

import { exposeQuery } from '../../queries/queryHelpers';
import { userImpersonatedSession } from '../queries';

exposeQuery({
  query: userImpersonatedSession,
  overrides: {
    firewall(userId, params) {
      if (!userId) {
        params._userId = 'none';
      }
    },
    embody: (body) => {
      body.$filter = ({ filters, params }) => {
        filters.userId = params._userId;
        filters.isImpersonate = true;
        // filters.shared = true;
      };

      body.$postFilter = (result) => {
        if (result.length) {
          return [result[0]];
        }

        return result;
      };
    },
  },
});
