import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

export default (count, role) => {
  const insertedUsers = [];
  for (let i = 0; i < count; i += 1) {
    const userId = Accounts.createUser({
      email: `${role}-${i + 1}@epotek.ch`,
      password: '12345',
    });
    Roles.addUsersToRoles(userId, [role]);
    insertedUsers.push(userId);
  }
  return insertedUsers;
};
