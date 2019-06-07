import Users from '.';
import { USER_QUERIES } from './userConstants';
import {
  adminUser,
  appUser as appUserFragment,
  fullUser,
  proUser as proUserFragment,
} from '../fragments';

import {
  createRegexQuery,
  generateMatchAnyWordRegexp,
} from '../helpers/mongoHelpers';

export const adminUsers = Users.createQuery(
  USER_QUERIES.ADMIN_USERS,
  adminUser(),
);

export const appUser = Users.createQuery(
  USER_QUERIES.APP_USER,
  appUserFragment(),
  {
    scoped: true,
  },
);

export const currentUser = Users.createQuery(
  USER_QUERIES.CURRENT_USER,
  fullUser(),
  {
    scoped: true,
  },
);

export const proReferredByUsers = Users.createQuery(
  USER_QUERIES.PRO_REFERRED_BY,
  () => {},
);

export const proUser = Users.createQuery(
  USER_QUERIES.PRO_USER,
  proUserFragment(),
);

export const userEmails = Users.createQuery(USER_QUERIES.USER_EMAILS, {
  $filter({ filters, params: { _id } }) {
    filters._id = _id;
  },
  sentEmails: 1,
});

const queryHasSpace = query => query.indexOf(' ') > -1;

export const userSearch = Users.createQuery(USER_QUERIES.USER_SEARCH, {
  $filter({ filters, params: { searchQuery, roles } }) {
    const formattedSearchQuery = generateMatchAnyWordRegexp(searchQuery);
    if (roles) {
      filters.roles = { $in: roles };
    }
    filters.$or = [
      createRegexQuery('_id', searchQuery),
      createRegexQuery('emails.0.address', searchQuery),
      createRegexQuery('firstName', searchQuery),
      createRegexQuery('lastName', searchQuery),
      {
        $and: [
          createRegexQuery('firstName', formattedSearchQuery),
          createRegexQuery('lastName', formattedSearchQuery),
        ],
      },
    ];

    if (queryHasSpace(searchQuery)) {
      filters.$or.push();
    }
  },
  assignedEmployee: { name: 1 },
  createdAt: 1,
  email: 1,
  loans: { name: 1 },
  name: 1,
  organisations: { name: 1 },
  roles: 1,
  $options: { limit: 5 },
});
