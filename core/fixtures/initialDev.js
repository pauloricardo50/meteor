import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

export default () => {
  const adminId = Accounts.createUser({
    email: 'dev@epotek.ch',
    password: '12345',
  });
  Roles.addUsersToRoles(adminId, ['dev']);
};
