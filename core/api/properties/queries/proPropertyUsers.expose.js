import query from './proPropertyUsers';
import PropertyService from '../server/PropertyService';
import SecurityService from '../../security';
import { proUser } from '../../fragments';

const anonymizeUsers = ({ users = [], userId, propertyId }) =>
  // TODO: users anonymization
  users;
query.expose({
  firewall(userId, params) {
    const { propertyId } = params;
    params.userId = userId;

    SecurityService.properties.isAllowedToView({ propertyId, userId });
  },
  validateParams: {
    propertyId: String,
    userId: String,
  },
});

query.resolve(({ userId, propertyId }) => {
  let users = [];
  const {
    user: propertyOwner,
    users: propertyProUsers = [],
  } = PropertyService.fetchOne({
    $filters: { _id: propertyId },
    user: proUser(),
    users: proUser(),
  });

  users = [...users, { ...propertyOwner, isOwner: true }, ...propertyProUsers];

  try {
    SecurityService.checkUserIsAdmin(userId);
    return users;
  } catch (error) {
    return anonymizeUsers({ users, userId, propertyId });
  }
});
