import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';

import { ROLES } from '../api/users/userConstants';

export const isUser = user => {
  if (!user) {
    return false;
  }

  const { ADMIN, DEV } = ROLES;
  const { roles } = user;
  // make sure `userRoles` is always an array - in case `roles` is a string
  const userRoles = flatten([roles]);

  const userHasRoles = userRoles && userRoles.length > 0;
  return userHasRoles && intersection(userRoles, [ADMIN, DEV]).length === 0;
};

export const getUserDisplayName = ({ firstName, lastName, emails } = {}) =>
  [firstName, lastName].filter(name => name).join(' ') ||
  (emails && emails[0] && emails[0].address) ||
  '';
