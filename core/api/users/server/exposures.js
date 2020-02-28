import { Match } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import { exposeQuery } from '../../queries/queryHelpers';
import { ROLES } from '../../constants';
import SecurityService from '../../security';
import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../../helpers/mongoHelpers';
import {
  adminUsers,
  appUser,
  currentUser,
  proReferredByUsers,
  userEmails,
  userSearch,
  proUser,
  incoherentAssignees,
} from '../queries';
import UserService from './UserService';
import { incoherentAssigneesResolver } from './resolvers';

exposeQuery({
  query: adminUsers,
  overrides: {
    firewall(userId) {
      SecurityService.checkUserIsAdmin(userId);
      params.userId = userId;
    },
    embody: body => {
      body.$filter = ({
        filters,
        params: { roles, _id, admins, assignedEmployeeId, userId },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (roles) {
          filters['roles._id'] = { $in: roles };
        }

        if (admins) {
          const userIsDev = Roles.userIsInRole(userId, ROLES.DEV);

          if (userIsDev) {
            filters['roles._id'] = { $in: [ROLES.ADMIN, ROLES.DEV] };
          } else {
            filters['roles._id'] = ROLES.ADMIN;
          }
        }

        if (assignedEmployeeId) {
          filters.assignedEmployeeId = assignedEmployeeId;
        }
      };
    },
    validateParams: {
      admins: Match.Maybe(Boolean),
      assignedEmployeeId: Match.Maybe(Match.OneOf(Object, String, null)),
      roles: Match.Maybe([String]),
      userId: String,
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
    embody: body => {
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
    embody: body => {
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
        referredByUserId,
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

      if (referredByUserId && referredByUserId !== 'nobody') {
        const org = UserService.getUserMainOrganisation(userId);
        if (!org.userLinks.find(({ _id }) => _id === userId)) {
          SecurityService.handleUnauthorized('Not allowed');
        }
      }
    },
    embody: body => {
      body.$filter = ({
        filters,
        params: {
          userId,
          organisationId: providedOrganisationId,
          referredByUserId,
        },
      }) => {
        let organisationId;
        if (!providedOrganisationId) {
          const { organisations = [] } = UserService.get(userId, {
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

        if (referredByUserId) {
          filters.referredByUserLink = referredByUserId;

          if (referredByUserId === 'nobody') {
            filters.referredByUserLink = { $in: [false, null] };
          }
        }
      };
    },
    validateParams: {
      userId: Match.Maybe(String),
      organisationId: Match.Maybe(String),
      ownReferredUsers: Match.Maybe(Boolean),
      referredByUserId: Match.Maybe(String),
    },
  },
});

exposeQuery({
  query: userEmails,
  overrides: {
    embody: body => {
      body.$filter = ({ filters, params: { _id } }) => {
        filters._id = _id;
      };
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: userSearch,
  overrides: {
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery, roles } }) => {
        const formattedSearchQuery = generateMatchAnyWordRegexp(searchQuery);
        if (roles) {
          filters['roles._id'] = { $in: roles };
        }
        filters.$or = [
          createRegexQuery('_id', searchQuery),
          createRegexQuery('emails.0.address', searchQuery),
          createRegexQuery('firstName', searchQuery),
          createRegexQuery('lastName', searchQuery),
          {
            $and: [
              createRegexQuery('firstName', formattedSearchQuery),
              createRegexQuery('lastName', formattedSearchQuery),
            ],
          },
        ];
      };
    },
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
    embody: body => {
      body.$filter = ({ filters, params }) => {
        filters._id = params._userId;
      };
    },
  },
});

exposeQuery({
  query: incoherentAssignees,
  resolver: incoherentAssigneesResolver,
});
