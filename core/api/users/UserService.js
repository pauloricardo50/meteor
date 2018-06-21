import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import ServerEventService from '../events/server/ServerEventService';
import { USER_EVENTS, ROLES } from './userConstants';
import Users from '../users';

class UserService {
  createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options);
    Roles.addUsersToRoles(newUserId, role);

    return newUserId;
  };

  adminCreateUser = ({ options, role }) => {
    const newUserId = this.createUser({ options, role });
    this.update({ userId: newUserId, object: { ...options } });
    try {
      this.sendEnrollmentEmail({ userId: newUserId });
    } catch (error) {
      console.log('Theodor error: ', error);
    }
    return newUserId;
  };

  // This should remain a simple inequality check
  doesUserExist = ({ email }) => Accounts.findUserByEmail(email) != null;

  sendVerificationEmail = ({ userId }) =>
    Accounts.sendVerificationEmail(userId);

  sendEnrollmentEmail = ({ userId }) => Accounts.sendEnrollmentEmail(userId);

  // This is used to hook into Accounts
  onCreateUser = (options, user) => {
    ServerEventService.emit(USER_EVENTS.USER_CREATED, { userId: user._id });

    return { ...user, roles: [ROLES.USER] };
  };

  remove = ({ userId }) => Users.remove(userId);

  update = ({ userId, object }) => Users.update(userId, { $set: object });

  assignAdminToUser = ({ userId, adminId }) =>
    this.update({ userId, object: { assignedEmployeeId: adminId } });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();

  setRole = ({ userId, role }) => Roles.setUserRoles(userId, role);

  getUserById = ({ userId }) => Users.findOne(userId);
}

export default new UserService();
