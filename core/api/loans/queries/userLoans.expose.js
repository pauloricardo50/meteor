import { Match } from 'meteor/check';

import SecurityService from '../../security';
import userLoans from './userLoans';

userLoans.expose({
  firewall(userId, params) {
    if (params.userId) {
      SecurityService.checkUserIsAdmin(userId);
    } else {
      params.userId = userId;
    }
  },
  embody: {
    $filter({ filters, params }) {
      filters.userId = params.userId;
    },
  },
  validateParams: { userId: String, $body: Match.Maybe(Object) },
});
