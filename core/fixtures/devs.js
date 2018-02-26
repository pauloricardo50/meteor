import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { DEVS } from './config';

export default () => {
  for (let i = 0; i < DEVS; i += 1) {
    const devId = Accounts.createUser({
      email: `dev-${i + 1}@epotek.ch`,
      password: '12345',
    });
    Roles.addUsersToRoles(devId, ['dev']);
  }
};
