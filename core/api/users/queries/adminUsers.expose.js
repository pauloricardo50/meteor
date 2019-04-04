import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './adminUsers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {
    assignedTo: Match.Maybe(String),
    roles: Match.Maybe([String]),
    $body: Match.Maybe(Object),
  },
  embody: {
    $filter({ filters, params: { assignedTo, roles } }) {
      if (assignedTo) {
        filters.assignedEmployeeId = assignedTo;
      }

      if (roles) {
        filters.roles = { $in: roles };
      }
    },
  },
});
