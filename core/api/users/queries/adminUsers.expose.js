import { Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminUsers';
import { ROLES } from '../../constants';

exposeQuery(query, {
  embody: {
    $filter({ filters, params: { assignedTo, roles, _id, admins } }) {
      if (_id) {
        filters._id = _id;
      }

      if (assignedTo) {
        filters.assignedEmployeeId = assignedTo;
      }

      if (roles) {
        filters.roles = { $in: roles };
      }

      if (admins) {
        const userIsDev = Roles.userIsInRole(Meteor.user(), ROLES.DEV);

        if (userIsDev) {
          filters.roles = { $in: [ROLES.ADMIN, ROLES.DEV] };
        } else {
          filters.roles = { $in: [ROLES.ADMIN] };
        }
      }
    },
  },
  validateParams: {
    _id: Match.Maybe(String),
    assignedTo: Match.Maybe(String),
    roles: Match.Maybe([String]),
    admins: Match.Maybe(Boolean),
  },
});
