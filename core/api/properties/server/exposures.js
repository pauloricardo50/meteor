import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import {
  adminProperties,
  anonymousProperty,
  proProperties,
  userProperty,
  proPropertyUsers,
  propertySearch,
} from '../queries';
import Security from '../../security';
import { proPropertiesResolver, proPropertyUsersResolver } from './resolvers';

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
    validateParams: {
      userId: Match.Maybe(String),
      fetchOrganisationProperties: Match.Maybe(Boolean),
    },
  },
  options: { allowFilterById: true },
  resolver: proPropertiesResolver,
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
    validateParams: {
      propertyId: String,
      userId: String,
    },
  },
  resolver: proPropertyUsersResolver,
});

exposeQuery({
  query: propertySearch,
  overrides: {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});
