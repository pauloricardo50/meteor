import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../api';

export const createFakeUsers = (count, role, currentUserEmail = '') => {
  const insertedUsers = [];
  for (let i = 0; i < count; i += 1) {
    const email = `${role}-${i + 1}@e-potek.ch`;
    if (email !== currentUserEmail) {
      insertedUsers.push(createUser(email, role));
    }
  }
  return insertedUsers;
};

export const createUser = (email, role) => {
  const userId = Accounts.createUser({
    email,
    password: '12345',
  });
  Roles.addUsersToRoles(userId, [role]);

  return userId;
};

export const getFakeUsersIds = () => {
  const regex = /^(admin|dev|user)-[1-9]|10@e-potek.ch/;
  const allUsers = Users.find().fetch();
  const fakeUserIds = allUsers
    .filter(user => regex.test(user.emails[0].address))
    .map(fakeUser => fakeUser._id);
  return fakeUserIds;
};
