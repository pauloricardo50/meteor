import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './tasks';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {
    assignedTo: Match.Maybe(String),
    unassigned: Match.Maybe(Boolean),
    dashboardTasks: Match.Maybe(Boolean),
    file: Match.Maybe(String),
    status: Match.Maybe(String),
    type: Match.Maybe(String),
    user: Match.Maybe(String),
  },
});
