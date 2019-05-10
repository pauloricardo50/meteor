import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './appUser';

query.expose({
  firewall(userId, params) {
    SecurityService.checkLoggedIn();
    params.userId = userId;
  },
  embody: {
    $filter({ filters, params }) {
      filters._id = params.userId;
    },
  },
  validateParams: { userId: Match.Maybe(String) },
});
