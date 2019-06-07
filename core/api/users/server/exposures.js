import { Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

import { exposeQuery } from '../../queries/queryHelpers';
import {
  adminUsers,
  appUser,
  currentUser,
  proReferredByUsers,
  userEmails,
  userSearch,
  proUser,
} from '../queries';
import { ROLES } from '../../constants';
import SecurityService from '../../security';
import UserService from './UserService';
import { proUser as proUserFragment } from '../../fragments';

exposeQuery(
  adminUsers,
  {
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
  { allowFilterById: true },
);

exposeQuery(
  appUser,
  {
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
  {},
);

exposeQuery(
  currentUser,
  {
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
  {},
);

exposeQuery(
  proReferredByUsers,
  {
    firewall(userId, params) {
      const { userId: providedUserId, organisationId } = params;

      SecurityService.checkUserIsPro(userId);

      if (providedUserId) {
        SecurityService.checkUserIsAdmin(userId);
        params.userId = providedUserId;
      } else {
        params.userId = userId;
      }

      if (organisationId) {
        SecurityService.checkUserIsAdmin(userId);
      }
    },
    validateParams: {
      userId: String,
      organisationId: Match.Maybe(String),
    },
  },
  {},
);

proReferredByUsers.resolve(({ userId, organisationId: providedOrganisationId }) => {
  let organisationId;
  if (!providedOrganisationId) {
    const { organisations = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      organisations: { _id: 1 },
    });
    organisationId = !!organisations.length && organisations[0]._id;
  } else {
    organisationId = providedOrganisationId;
  }

  const users = UserService.fetch({
    $filters: {
      $or: [
        { referredByUserLink: userId },
        organisationId && { referredByOrganisationLink: organisationId },
      ].filter(x => x),
    },
    ...proUserFragment(),
  });

  return users;
});

exposeQuery(userEmails);

exposeQuery(
  userSearch,
  {
    validateParams: {
      searchQuery: Match.Maybe(String),
      roles: Match.Maybe([String]),
    },
  },
  {},
);

exposeQuery(proUser, {
  firewall(userId, params) {},
  embody: (body) => {
    // This will deepExtend your body
    body.$filter = ({ filters, params }) => {
      filters._id = params._userId;
    };
  },
});
