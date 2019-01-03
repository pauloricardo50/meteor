import { Match } from 'meteor/check';

import Security from '../../security';
import query from './sideNavProperties';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
  validateParams: { limit: Match.Maybe(Number), skip: Match.Maybe(Number) },
});
