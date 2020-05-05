import { Roles } from 'meteor/alanning:roles';

import { ROLES } from './userConstants';

Object.values(ROLES).forEach(role => {
  Roles.createRole(role, { unlessExists: true });
});
