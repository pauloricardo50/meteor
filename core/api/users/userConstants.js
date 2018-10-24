// Not actually used to create a meteor collection, but useful to switch()
// on collection names
export const USERS_COLLECTION = 'users';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  DEV: 'dev',
};

export const USER_QUERIES = {
  ADMIN_USERS: 'ADMIN_USERS',
  ADMIN_USER: 'ADMIN_USER',
  ADMINS: 'ADMINS',
  SIDENAV_USERS: 'SIDENAV_USERS',
  CURRENT_USER: 'CURRENT_USER',
  APP_USER: 'APP_USER',
  USER_SEARCH: 'USER_SEARCH',
  USER_EMAILS: 'USER_EMAILS',
};

export const USER_EVENTS = {
  USER_CREATED: 'USER_CREATED',
};
