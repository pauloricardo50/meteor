import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proLoans';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsPro(userId);
    // FIXME: Should check is this promotion can be visited by the user
  },
  validateParams: {
    promotionId: Match.Maybe(String),
    propertyId: Match.Maybe(String),
  },
});
