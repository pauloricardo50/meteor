import { Match } from 'meteor/check';

import Security from '../../security';
import query from './promotionSearch';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
  validateParams: { searchQuery: Match.Maybe(String) },
});
