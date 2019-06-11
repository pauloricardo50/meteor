import { Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

import { exposeQuery } from '../../queries/queryHelpers';
import { ROLES } from '../../constants';
import SecurityService from '../../security';
import {
  adminUsers,
  appUser,
  currentUser,
  proReferredByUsers,
  userEmails,
  userSearch,
  proUser,
} from '../queries';
import { proReferredByUsersResolver } from './resolvers';

exposeQuery({
  query: adminUsers,
  overrides: {
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: { assignedTo, roles, _id, admins, assignedEmployeeId, _userId },
      }) => {
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

        if (assignedEmployeeId) {
          filters.assignedEmployeeId = assignedEmployeeId;
        }
      };
    },
    validateParams: {
      assignedTo: Match.Maybe(String),
      roles: Match.Maybe([String]),
      admins: Match.Maybe(Boolean),
      assignedEmployeeId: Match.Maybe(String),
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: appUser,
  overrides: {
    firewall(userId, params) {
      if (!userId) {
        // Don't throw unauthorized error here, it causes race-conditions in E2E tests
        // to not reload this subscription
        // So simply set userId to an impossible id
        params._userId = 'none';
      }
    },
    embody: (body) => {
      body.$filter = ({ filters, params }) => {
        filters._id = params._userId;
      };
    },
  },
});

exposeQuery({
  query: currentUser,
  overrides: {
    firewall(userId, params) {
      if (!userId) {
        // Don't throw unauthorized error here, it causes race-conditions in E2E tests
        // to not reload this subscription
        // So simply set userId to an impossible id
        params._userId = 'none';
      }
    },
    embody: (body) => {
      // This will deepExtend your body
      body.$filter = ({ filters, params }) => {
        filters._id = params._userId;
      };
    },
  },
});

exposeQuery({
  query: proReferredByUsers,
  overrides: {
    firewall(userId, params) {
      const {
        userId: providedUserId,
        organisationId,
        ownReferredUsers,
      } = params;

      SecurityService.checkUserIsPro(userId);

      if (providedUserId) {
        SecurityService.checkUserIsAdmin(userId);
        params.userId = providedUserId;
      }

      if (ownReferredUsers) {
        params.userId = userId;
      }

      if (organisationId) {
        SecurityService.checkUserIsAdmin(userId);
      }
    },
    validateParams: {
      userId: Match.Maybe(String),
      organisationId: Match.Maybe(String),
      ownReferredUsers: Match.Maybe(Boolean),
    },
  },
  resolver: proReferredByUsersResolver,
});

exposeQuery({ query: userEmails });

exposeQuery({
  query: userSearch,
  overrides: {
    validateParams: {
      searchQuery: Match.Maybe(String),
      roles: Match.Maybe([String]),
    },
  },
});

exposeQuery({
  query: proUser,
  overrides: {
    firewall(userId, params) {},
    embody: (body) => {
      body.$filter = ({ filters, params }) => {
        filters._id = params._userId;
      };
    },
  },
});
