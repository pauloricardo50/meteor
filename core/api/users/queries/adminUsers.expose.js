import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './adminUsers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: { assignedTo: Match.Maybe(String) },
});
