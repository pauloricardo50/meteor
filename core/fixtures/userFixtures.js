import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import faker from 'faker/locale/fr';

import { Users } from '../api';
import { USER_PASSWORD } from './fixtureConstants';
import UserService from '../api/users/UserService';

export const createUser = (email, role, password) => {
  const userId = Accounts.createUser({
    email,
    password: password || USER_PASSWORD,
  });
  Roles.setUserRoles(userId, [role]);

  return userId;
};

export const createFakeUsers = (count, role, currentUserEmail = '') => {
  const insertedUsers = [];
  for (let i = 0; i < count; i += 1) {
    const email = `${role}-${i + 1}@e-potek.ch`;
    if (email !== currentUserEmail) {
      const newUserId = createUser(email, role);

      UserService.update({
        userId: newUserId,
        object: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
      });
      insertedUsers.push(newUserId);
    }
  }
  return insertedUsers;
};

export const addUser = ({ email, role, password, ...data }) => {
  const newUserId = createUser(email, role, password);
  UserService.update({ userId: newUserId, object: data });
  return newUserId;
};

export const createDevs = (currentEmail) => {
  const devs = [
    {
      email: 'florian@e-potek.ch',
      firstName: 'Florian',
      lastName: 'Bienefelt',
      role: 'dev',
      password: '12345',
    },
    {
      email: 'quentin@e-potek.ch',
      firstName: 'Quentin',
      lastName: 'Herzig',
      role: 'dev',
      password: '12345',
    },
  ];
  return devs.filter(({ email }) => email !== currentEmail).map(addUser);
};

export const createAdmins = () => {
  const devs = [
    {
      email: 'lydia@e-potek.ch',
      firstName: 'Lydia',
      lastName: 'Abraha',
      role: 'admin',
    },
    {
      email: 'joel@e-potek.ch',
      firstName: 'Joel',
      lastName: 'Santos',
      role: 'admin',
    },
    {
      email: 'yannis@e-potek.ch',
      firstName: 'Yannis',
      lastName: 'Eggert',
      role: 'admin',
    },
    {
      email: 'jeanluc@e-potek.ch',
      firstName: 'Jean-luc',
      lastName: 'Kringel',
      role: 'admin',
    },
  ];
  return devs.map(addUser);
};

export const getFakeUsersIds = () => {
  const regex = /^(admin|dev|user)-[1-9]|10@e-potek.ch/;
  const allUsers = Users.find().fetch();
  const fakeUserIds = allUsers
    .filter(user => regex.test(user.emails[0].address))
    .map(fakeUser => fakeUser._id);
  return fakeUserIds;
};
