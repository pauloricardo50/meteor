import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { ADMINS } from './config';

export default () => {
  const admins = [];
  for (let i = 0; i < ADMINS; i += 1) {
    const adminId = Accounts.createUser({
      email: `admin-${i + 1}@epotek.ch`,
      password: '12345',
    });
    Roles.addUsersToRoles(adminId, ['admin']);
    admins.push(adminId);
  }
  return admins;
};
