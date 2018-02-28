import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import Users from '../users';

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

  static update = ({ userId, user }) => {
    Users.update(userId, { $set: user });
  };

  static getAdmins = () => Users.find({ roles: { $in: ['admin'] } }).fetch();
}

export default UserService;
