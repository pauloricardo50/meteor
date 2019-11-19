import {
  adminUser,
  appUser as appUserFragment,
  fullUser,
  proUser as proUserFragment,
} from '../fragments';

import { USER_QUERIES } from './userConstants';
import Users from '.';

export const adminUsers = Users.createQuery(
  USER_QUERIES.ADMIN_USERS,
  adminUser(),
  { scoped: true },
);

export const appUser = Users.createQuery(
  USER_QUERIES.APP_USER,
  appUserFragment(),
  { scoped: true },
);

export const currentUser = Users.createQuery(
  USER_QUERIES.CURRENT_USER,
  fullUser(),
  { scoped: true },
);

export const proReferredByUsers = Users.createQuery(
  USER_QUERIES.PRO_REFERRED_BY,
  proUserFragment(),
);

export const proUser = Users.createQuery(
  USER_QUERIES.PRO_USER,
  proUserFragment(),
  { scoped: true },
);

export const userEmails = Users.createQuery(USER_QUERIES.USER_EMAILS, {
  sentEmails: 1,
});

export const userSearch = Users.createQuery(USER_QUERIES.USER_SEARCH, {
  assignedEmployee: { name: 1 },
  createdAt: 1,
  email: 1,
  loans: { name: 1 },
  name: 1,
  organisations: { name: 1 },
  roles: 1,
  $options: { limit: 5 },
});
