import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import ServerEventService from '../events/server/ServerEventService';
import { USER_EVENTS, ROLES } from './userConstants';
import Users from '.';
import Loans from '../loans';

class UserService {
  createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options);
    Roles.addUsersToRoles(newUserId, role);

    return newUserId;
  };

  adminCreateUser = ({
    options: { email, sendEnrollmentEmail, ...additionalData },
    role,
    adminId,
  }) => {
    const newUserId = this.createUser({ options: { email }, role });

    this.update({ userId: newUserId, object: additionalData });

    if (role === ROLES.USER && adminId && !additionalData.assignedEmployeeId) {
      this.assignAdminToUser({ userId: newUserId, adminId });
    }

    if (sendEnrollmentEmail) {
      this.sendEnrollmentEmail({ userId: newUserId });
    }

    return newUserId;
  };

  // This should remain a simple inequality check
  doesUserExist = ({ email }) => Accounts.findUserByEmail(email) != null;

  sendVerificationEmail = ({ userId }) =>
    Accounts.sendVerificationEmail(userId);

  sendEnrollmentEmail = ({ userId }) => {
    Accounts.sendEnrollmentEmail(userId);
  };

  // This is used to hook into Accounts
  onCreateUser = (options, user) => {
    ServerEventService.emit(USER_EVENTS.USER_CREATED, { userId: user._id });
    return { ...user, roles: [ROLES.USER] };
  };

  remove = ({ userId }) => Users.remove(userId);

  allowUpdate = ({ object }) => object && Object.keys(object).length !== 0;

  update = ({ userId, object }) =>
    this.allowUpdate({ object }) && Users.update(userId, { $set: object });

  assignAdminToUser = ({ userId, adminId }) =>
    adminId && this.update({ userId, object: { assignedEmployeeId: adminId } });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();

  setRole = ({ userId, role }) => Roles.setUserRoles(userId, role);

  getUserById = ({ userId }) => Users.findOne(userId);

  getUserByPasswordResetToken = ({ token }) =>
    Users.findOne(
      { 'services.password.reset.token': token },
      { fields: { firstName: 1, lastName: 1, emails: 1 } },
    );

  testCreateUser = ({ user }) => Users.insert(user);

  hasPromotion = ({ userId, promotionId }) => {
    const loans = Loans.find({ userId }).fetch();
    return (
      loans.filter(({ promotionLinks: { _id } }) => _id === promotionId)
        .length > 0
    );
  };
}

export default new UserService();
