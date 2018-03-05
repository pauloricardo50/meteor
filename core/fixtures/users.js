import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import EventService from 'core/api/events';
import { USER_EVENTS } from 'core/api/users/userConstants';

const createFakeUsers = (count, role) => {
  const insertedUsers = [];
  for (let i = 0; i < count; i += 1) {
    const userId = Accounts.createUser({
      email: `${role}-${i + 1}@epotek.ch`,
      password: '12345',
    });
    Roles.addUsersToRoles(userId, [role]);
    EventService.emit(USER_EVENTS.USER_CREATED, { userId });
    insertedUsers.push(userId);
  }
  return insertedUsers;
};

export default createFakeUsers;
