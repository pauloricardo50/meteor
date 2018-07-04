import { _ } from 'meteor/underscore';
import { ROLES } from '../api/users/userConstants';

export const isUser = (user) => {
  if (!user) {
    return false;
  }

  const { ADMIN, DEV } = ROLES;
  const { roles } = user;
  // make sure `userRoles` is always an array - in case `roles` is a string
  const userRoles = _.flatten([roles]);

  const userHasRoles = userRoles && userRoles.length > 0;
  return userHasRoles && _.intersection(userRoles, [ADMIN, DEV]).length === 0;
};

export const getUserDisplayName = ({ firstName, lastName, username, emails }) =>
  [firstName, lastName].filter(name => name).join(' ') ||
  username ||
  (emails && emails[0].address);
