import { hasMinimumRole } from './generalSecurityHelpers';
import { ROLES } from '../../users/userConstants';

export const isPropertyOwner = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;
  const { userId: propertyOwner } = property;

  return propertyOwner === userId;
};

export const isAllowedToViewProProperty = ({ property, currentUser }) => {
  const { _id: userId } = currentUser;

  if (hasMinimumRole({ role: ROLES.ADMIN, userId })) {
    return true;
  }

  if (isPropertyOwner({ property, currentUser })) {
    return true;
  }

  const { userLinks = [], users = [] } = property;

  const user = userLinks.find(({ _id }) => _id === userId)
    || users.find(({ _id }) => _id === userId);

  if (!user) {
    return false;
  }

  return true;
};
