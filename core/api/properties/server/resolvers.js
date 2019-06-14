import { proUser } from '../../fragments';
import PropertyService from './PropertyService';

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
