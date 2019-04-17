import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './currentUser';

query.expose({
  firewall(userId, params) {
    params.userId = userId;
  },
  validateParams: { userId: Match.Maybe(String), $body: Match.Maybe(Object) },
  embody: {
    // This will deepExtend your body
    $filter({ filters, params }) {
      filters._id = params.userId;
    },
  },
});
