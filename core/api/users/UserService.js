import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import EventService from 'core/api/events';
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

  getAdmins = () => Users.find({ roles: { $in: ['admin'] } }).fetch();
}

export default new UserService();
