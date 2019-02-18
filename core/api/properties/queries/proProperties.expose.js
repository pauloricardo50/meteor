import { Match } from 'meteor/check';

import Security from '../../security';
import query from './proProperties';

query.expose({
  firewall(userId, params) {
    if (params.userId) {
      Security.checkUserIsAdmin(userId);
    } else {
      Security.checkUserIsPro(userId);
      params.userId = userId;
    }
  },
  validateParams: { userId: Match.Maybe(String) },
  embody: {
    $filter({ filters, params }) {
      filters.userId = params.userId;
    },
  },
});
