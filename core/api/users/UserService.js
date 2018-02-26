import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import Users from '../users';
import adminsQuery from './queries/admins';

class UserService {
  static createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options, (err) => {
      if (err) console.log(err);
      else {
        Roles.addUsersToRoles(newUserId, role);
        return newUserId;
      }
      return null;
    });
  };

  static remove = ({ userId }) => {
    Users.remove(userId);
  };

  static update = ({ userId, object }) => {
    Users.update(userId, { $set: object });
  };

  static getAdmins = () => Users.find({ roles: { $in: ['admin'] } }).fetch();
}

export default UserService;
