import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { ROLES } from '../../users/userConstants';

class UserSecurity {
  checkPermissionToAddUser = ({ role }) => {
    const userId = Meteor.userId();

    if (!Object.values(ROLES).includes(role)) {
      throw new Meteor.Error(
        'INCORRECT_ROLE',
        'You can only create accounts with one of the accepted roles.',
      );
    }

    if (role === ROLES.DEV && !Roles.userIsInRole(userId, ROLES.DEV)) {
      throw new Meteor.Error(
        'NOT_AUTHORIZED',
        "You don't have enough privileges to create a dev account",
      );
    }

    if (role === ROLES.ADMIN && !Roles.userIsInRole(userId, ROLES.DEV)) {
      throw new Meteor.Error(
        'NOT_AUTHORIZED',
        "You don't have enough privileges to create an admin account",
      );
    }

    if (
      !(
        Roles.userIsInRole(userId, ROLES.DEV) ||
        Roles.userIsInRole(userId, ROLES.ADMIN)
      )
    ) {
      throw new Meteor.Error(
        'NOT_AUTHORIZED',
        "You don't have enough privileges to create an account",
      );
    }
  };
}

export default new UserSecurity();
