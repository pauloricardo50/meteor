import { Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';

import { exposeQuery } from '../../queries/queryHelpers';
import { ROLES } from '../../constants';
import SecurityService from '../../security';
import UserService from './UserService';
import {
  adminUsers,
  appUser,
  currentUser,
  proReferredByUsers,
  userEmails,
  userSearch,
  proUser,
} from '../queries';

exposeQuery({
  query: adminUsers,
  overrides: {
    embody: (body) => {
      body.$filter = ({
        filters,
        params: { roles, _id, admins, assignedEmployeeId },
      }) => {
        if (_id) {
          filters._id = _id;
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
      roles: Match.Maybe([String]),
      admins: Match.Maybe(Boolean),
      assignedEmployeeId: Match.Maybe(Match.OneOf(Object, String, null)),
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
    embody: (body) => {
      body.$filter = ({
        filters,
        params: { userId, organisationId: providedOrganisationId },
      }) => {
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

        const or = [
          userId && { referredByUserLink: userId },
          organisationId && { referredByOrganisationLink: organisationId },
        ].filter(x => x);

        filters.$or = or;
      };
    },
    validateParams: {
      userId: Match.Maybe(String),
      organisationId: Match.Maybe(String),
      ownReferredUsers: Match.Maybe(Boolean),
    },
  },
});

exposeQuery({ query: userEmails, options: { allowFilterById: true } });

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
    firewall: (userId, params) => {
      if (userId) {
        SecurityService.checkUserIsPro(userId);
      } else {
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
