import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Users } from '../..';
import { ROLES, USER_QUERIES } from '../../constants';
import { simpleUser } from '../../fragments';

export default Users.createQuery(USER_QUERIES.ADMINS, {
  $filter({ filters }) {
    const userIsDev = Roles.userIsInRole(Meteor.user(), ROLES.DEV);

    if (userIsDev) {
      filters.roles = { $in: [ROLES.ADMIN, ROLES.DEV] };
    } else {
      filters.roles = { $in: [ROLES.ADMIN] };
    }
  },
  ...simpleUser(),
});
