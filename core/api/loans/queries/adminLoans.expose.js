import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './adminLoans';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {
    searchQuery: Match.Maybe(String),
    owned: Match.Maybe(Boolean),
  },
});
