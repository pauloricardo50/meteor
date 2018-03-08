import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import EventService from '../events';
import { USER_EVENTS } from './userConstants';
import Users from '../users';

class UserService {
  createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options, (err) => {
      if (err) console.log(err);
      else {
        Roles.addUsersToRoles(newUserId, role);
        if (role === 'user') {
          EventService.emit(USER_EVENTS.USER_CREATED, { newUserId });
        }
        return newUserId;
      }
      return null;
    });
  };

  remove = ({ userId }) => {
    Users.remove(userId);
  };

  update = ({ userId, user }) => Users.update(userId, { $set: user });

  assignAdminToUser = ({ userId, adminId }) =>
    this.update({
      userId,
      user: { assignedTo: adminId },
    });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();
}

export default new UserService();
