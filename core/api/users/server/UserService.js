import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import Users from '../users';
import adminsQuery from './queries/admins';

export default class {
  static createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options);
    Roles.addUsersToRoles(newUserId, role);
    return newUserId;
  };

  static doesUserExist = ({ email }) =>
    // This should remain a simple inequality check
    Accounts.findUserByEmail(email) != null;

  static sendVerificationEmail = ({ userId }) =>
    Accounts.sendVerificationEmail(userId);
}
