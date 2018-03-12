import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import EventService from '../events';
import { USER_EVENTS } from './userConstants';
import Users from '../users';

class UserService {
  createUser = ({ options, role }) => {
    let newUserId;
    try {
      newUserId = Accounts.createUser(options);
      Roles.addUsersToRoles(newUserId, role);

      if (role === 'user') {
        EventService.emit(USER_EVENTS.USER_CREATED, { newUserId });
      }
    } catch (error) {
      throw new Meteor.Error(error);
    }

    return newUserId;
  };

  remove = ({ userId }) => Users.remove(userId);

  update = ({ userId, object }) => Users.update(userId, { $set: object });

  assignAdminToUser = ({ userId, adminId }) =>
    this.update({ userId, object: { assignedEmployeeId: adminId } });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();
}

export default new UserService();
