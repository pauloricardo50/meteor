import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './userSearch';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {
    searchQuery: Match.Maybe(String),
    roles: Match.Maybe([String]),
  },
});
