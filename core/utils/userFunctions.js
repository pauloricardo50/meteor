import { ROLES } from '../api/users/userConstants';

export const isUser = (user) => {
  const { ADMIN, DEV } = ROLES;
  const { roles: userRoles } = user;

  const userHasRoles = userRoles && userRoles.length > 0;
  return userHasRoles && _.intersection(userRoles, [ADMIN, DEV]).length === 0;
};
