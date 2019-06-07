import { proPropertySummary, proProperty, proUser } from '../../fragments';
import UserService from '../../users/server/UserService';
import PropertyService from './PropertyService';

export const proPropertiesResolver = ({
  userId,
  _id: propertyId,
  fetchOrganisationProperties,
}) => {
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
      ? organisations[0].users.map(({ _id }) => _id).filter(id => id !== userId)
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
};

export const proPropertyUsersResolver = ({ propertyId }) => {
  const property = PropertyService.fetchOne({
    $filters: { _id: propertyId },
    users: proUser(),
  });

  if (!property) {
    return [];
  }

  const { users = [] } = property;

  return users;
};
