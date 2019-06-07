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
import { proPropertySummary, proProperty, proUser } from '../../fragments';
import UserService from '../../users/server/UserService';
import PropertyService from './PropertyService';

exposeQuery(adminProperties, {}, { allowFilterById: true });
exposeQuery(
  anonymousProperty,
  {
    firewall(userId, { _id }) {
      Security.properties.checkPropertyIsPublic({ propertyId: _id });
    },
  },
  { allowFilterById: true },
);

exposeQuery(
  proProperties,
  {
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
  { allowFilterById: true },
);

proProperties.resolve(({ userId, _id: propertyId, fetchOrganisationProperties }) => {
  const fragment = propertyId ? proProperty() : proPropertySummary();
  let $filters;

  if (propertyId) {
    $filters = { _id: propertyId };
  }

  if (userId) {
    $filters = { ...$filters, 'userLinks._id': userId };
  }

  if (fetchOrganisationProperties) {
    const { organisations = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      organisations: { users: { _id: 1 } },
    });

    const otherOrganisationUsers = organisations.length
      ? organisations[0].users
        .map(({ _id }) => _id)
        .filter(id => id !== userId)
      : [];

    $filters = {
      $and: [
        { 'userLinks._id': { $in: otherOrganisationUsers } },
        { 'userLinks._id': { $nin: [userId] } },
      ],
    };
  }

  const properties = PropertyService.fetch({
    $filters,
    ...fragment,
  });

  return properties;
});

exposeQuery(
  userProperty,
  {
    firewall(userId, { _id: propertyId }) {
      Security.properties.hasAccessToProperty({ propertyId, userId });
    },
  },
  { allowFilterById: true },
);

exposeQuery(
  proPropertyUsers,
  {
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
  {},
);

proPropertyUsers.resolve(({ propertyId }) => {
  const property = PropertyService.fetchOne({
    $filters: { _id: propertyId },
    users: proUser(),
  });

  if (!property) {
    return [];
  }

  const { users = [] } = property;

  return users;
});

exposeQuery(
  propertySearch,
  {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  {},
);
