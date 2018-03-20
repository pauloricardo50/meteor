import EventService from '../events';
import { USER_EVENTS, ROLES } from './userConstants';
import Users from '../users';

class UserService {
  // This is used to hook into Accounts
  onCreateUser = (options, user) => {
    EventService.emit(USER_EVENTS.USER_CREATED, { userId: user._id });

    return { ...user, roles: ROLES.USER };
  };

  remove = ({ userId }) => Users.remove(userId);

  update = ({ userId, object }) => Users.update(userId, { $set: object });

  assignAdminToUser = ({ userId, adminId }) =>
    this.update({ userId, object: { assignedEmployeeId: adminId } });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();
}

export default new UserService();
