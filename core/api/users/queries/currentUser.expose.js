import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './currentUser';

query.expose({
  firewall(userId, params) {
    SecurityService.checkLoggedIn();
    params._id = userId;
  },
  validateParams: { _id: Match.Maybe(String), $body: Match.Maybe(Object) },
  embody: {
    // This will deepExtend your body
    $filter({ filters, params }) {
      filters._id = params._id;
    },
  },
});
