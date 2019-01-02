import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './sideNavBorrowers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: { limit: Match.Maybe(Number), skip: Match.Maybe(Number) },
});
