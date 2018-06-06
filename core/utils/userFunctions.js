import intersection from 'lodash/interesection';
import { ROLES } from '../api/users/userConstants';

export const isUser = (user) => {
  if (!user) {
    return false;
  }

  const { ADMIN, DEV } = ROLES;
  const { roles: userRoles } = user;

  const userHasRoles = userRoles && userRoles.length > 0;
  return userHasRoles && intersection(userRoles, [ADMIN, DEV]).length === 0;
};
