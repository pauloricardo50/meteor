import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

const createFakeUsers = (count, role, currentUserEmail = '') => {
  const insertedUsers = [];
  for (let i = 0; i < count; i += 1) {
    const email = `${role}-${i + 1}@epotek.ch`;
    if (email !== currentUserEmail) {
      const userId = Accounts.createUser({
        email,
        password: '12345',
      });
      Roles.addUsersToRoles(userId, [role]);
      insertedUsers.push(userId);
    }
  }
  return insertedUsers;
};

export default createFakeUsers;
