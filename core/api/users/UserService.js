import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import EventService from '../events';
import { USER_EVENTS, ROLES } from './userConstants';
import Users from '../users';

class UserService {
  createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options);
    Roles.addUsersToRoles(newUserId, role);

    return newUserId;
  };

  adminCreateUser = ({ options, role }) => {
    const { email } = options;

    if (this.doesUserExist({ email })) {
      throw new Meteor.Error('DUPLICATE_EMAIL', 'Email already exists.');
    }

    const newUserId = this.createUser({ options, role });

    if (newUserId) {
      this.update({ userId: newUserId, object: { ...options } });
      Accounts.sendEnrollmentEmail(newUserId);
    }

    return newUserId;
  };

  // This should remain a simple inequality check
  doesUserExist = ({ email }) => Accounts.findUserByEmail(email) != null;

  sendVerificationEmail = ({ userId }) =>
    Accounts.sendVerificationEmail(userId);

  // This is used to hook into Accounts
  onCreateUser = (options, user) => {
    EventService.emit(USER_EVENTS.USER_CREATED, { userId: user._id });

    return { ...user, roles: [ROLES.USER] };
  };

  remove = ({ userId }) => Users.remove(userId);

  update = ({ userId, object }) => Users.update(userId, { $set: object });

  assignAdminToUser = ({ userId, adminId }) =>
    this.update({ userId, object: { assignedEmployeeId: adminId } });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();

  setRole = ({ userId, role }) => Roles.setUserRoles(userId, role);
}

export default new UserService();
