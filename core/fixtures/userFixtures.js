import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import faker from 'faker/locale/fr';

import { ORGANISATION_TYPES } from '../api/organisations/organisationConstants';
import OrganisationService from '../api/organisations/server/OrganisationService';
import UserService from '../api/users/server/UserService';
import { OFFICES, ROLES } from '../api/users/userConstants';
import { ADMIN_EMAIL } from '../cypress/server/e2eConstants';
import { USER_PASSWORD } from './fixtureConstants';

export const createUser = (email, role, password) => {
  let userId = UserService.getByEmail(email, { _id: 1 })?._id;

  if (!userId) {
    userId = Accounts.createUser({
      email,
      password: password || USER_PASSWORD,
    });
  }
  Roles.setUserRoles(userId, role);

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

export const addUser = ({
  email,
  role,
  password = USER_PASSWORD,
  orgId,
  ...data
}) => {
  const newUserId = createUser(email, role, password);
  UserService.update({
    userId: newUserId,
    object: {
      ...data,
      phoneNumbers: [faker.phone.phoneNumber()],
      'emails.0.verified': true,
    },
  });

  if (orgId) {
    UserService.updateOrganisations({
      userId: newUserId,
      newOrganisations: [{ _id: orgId, metadata: { isMain: true } }],
    });
  }

  return newUserId;
};

export const createEpotek = () => {
  const existingOrg = OrganisationService.get({ name: 'e-Potek' }, { _id: 1 });
  if (existingOrg) {
    return existingOrg;
  }

  return OrganisationService.insert({
    name: 'e-Potek',
    type: ORGANISATION_TYPES.REAL_ESTATE_BROKER,
  });
};

export const createDevs = currentEmail => {
  const orgId = createEpotek();
  const devs = [
    {
      email: 'florian@e-potek.ch',
      firstName: 'Florian',
      lastName: 'Bienefelt',
    },
    {
      email: 'quentin@e-potek.ch',
      firstName: 'Quentin',
      lastName: 'Herzig',
    },
  ];
  return devs
    .filter(({ email }) => email !== currentEmail)
    .map(obj => ({ ...obj, role: ROLES.DEV }))
    .map(args => addUser({ ...args, orgId }));
};

export const createAdmins = () => {
  const orgId = createEpotek();

  const devs = [
    {
      email: 'lydia@e-potek.ch',
      firstName: 'Lydia',
      lastName: 'Abraha',
      office: OFFICES.GENEVA,
    },
    {
      email: 'yannis@e-potek.ch',
      firstName: 'Yannis',
      lastName: 'Eggert',
      office: OFFICES.GENEVA,
    },
    {
      email: 'jeanluc@e-potek.ch',
      firstName: 'Jean-luc',
      lastName: 'Kringel',
      office: OFFICES.LAUSANNE,
    },
    {
      email: ADMIN_EMAIL,
      firstName: 'Admin',
      lastName: 'e-Potek',
      office: OFFICES.LAUSANNE,
    },
  ];
  return devs
    .map(obj => ({ ...obj, role: ROLES.ADVISOR }))
    .map(args => addUser({ ...args, orgId }));
};

export const getFakeUsersIds = () => {
  const regex = /^(admin|dev|user)-[1-9]|10@e-potek.ch/;
  const allUsers = UserService.fetch({ email: 1 });
  const fakeUserIds = allUsers
    .filter(user => regex.test(user.email))
    .map(fakeUser => fakeUser._id);
  return fakeUserIds;
};
