import { Match } from 'meteor/check';

import UserService from '../../users/server/UserService';
import { exposeQuery } from '../../queries/queryHelpers';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import Security from '../../security';
import {
  adminProperties,
  anonymousProperty,
  proProperties,
  userProperty,
  proPropertyUsers,
  propertySearch,
} from '../queries';

exposeQuery({ query: adminProperties, options: { allowFilterById: true } });
exposeQuery({
  query: anonymousProperty,
  overrides: {
    firewall(userId, { _id }) {
      Security.properties.checkPropertyIsPublic({ propertyId: _id });
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: proProperties,
  overrides: {
    firewall(userId, params) {
      if (params.userId) {
        // When visiting a pro user's page from admin
        Security.checkUserIsAdmin(userId);
      } else {
        Security.checkUserIsPro(userId);
        params.userId = userId;
      }

      if (params._id) {
        Security.properties.hasAccessToProperty({
          propertyId: params._id,
          userId,
        });
      }
    },
    embody: (body, embodyParams) => {
      body.$filter = ({ filters, params }) => {
        const { _id: propertyId, userId, fetchOrganisationProperties } = params;
        if (propertyId) {
          filters._id = propertyId;
        }

        if (userId) {
          filters['userLinks._id'] = userId;
        }

        if (fetchOrganisationProperties) {
          const { organisations = [] } = UserService.fetchOne({
            $filters: { _id: userId },
            organisations: { users: { _id: 1 } },
          });

          const otherOrganisationUsers = organisations.length
            ? organisations[0].users
              .map(({ _id: orgUserId }) => orgUserId)
              .filter(id => id !== userId)
            : [];

          filters['userLinks._id'] = { $in: otherOrganisationUsers };
        }
      };

      body.$postFilter = (properties, params) => {
        const { fetchOrganisationProperties, userId } = params;

        if (fetchOrganisationProperties) {
          // Filter out properties this user is on, to avoid duplicates
          return properties.filter(({ userLinks }) =>
            !userLinks.some(({ _id: userLinkId }) => userLinkId === userId));
        }

        return properties;
      };
    },
    validateParams: {
      userId: Match.Maybe(String),
      fetchOrganisationProperties: Match.Maybe(Boolean),
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: userProperty,
  overrides: {
    firewall(userId, { _id: propertyId }) {
      Security.properties.hasAccessToProperty({ propertyId, userId });
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: proPropertyUsers,
  overrides: {
    firewall(userId, params) {
      const { propertyId } = params;
      params.userId = userId;

      Security.properties.isAllowedToView({ propertyId, userId });
    },
    embody: (body, embodyParams) => {
      body.$filter = ({ filters, params: { propertyId } }) => {
        filters._id = propertyId;
      };

      body.$postFilter = (properties = [], params) => {
        const property = !!properties.length && properties[0];

        if (!property) {
          return [];
        }

        const { users = [] } = property;
        return users;
      };
    },
    validateParams: {
      propertyId: String,
      userId: String,
    },
  },
});

exposeQuery({
  query: propertySearch,
  overrides: {
    validateParams: { searchQuery: Match.Maybe(String) },
    embody: (body) => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
        Object.assign(
          filters,
          createSearchFilters(['address1', 'city', '_id'], searchQuery),
        );
      };
    },
  },
});
