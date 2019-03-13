// Not actually used to create a meteor collection, but useful to switch()
// on collection names
export const USERS_COLLECTION = 'users';

export const ROLES = {
  ADMIN: 'admin',
  DEV: 'dev',
  USER: 'user',
  PRO: 'pro',
};

export const USER_QUERIES = {
  ADMIN_USER: 'ADMIN_USER',
  ADMIN_USERS: 'ADMIN_USERS',
  ADMINS: 'ADMINS',
  APP_USER: 'APP_USER',
  CURRENT_USER: 'CURRENT_USER',
  PRO_USER: 'PRO_USER',
  SIDENAV_USERS: 'SIDENAV_USERS',
  USER_SEARCH: 'USER_SEARCH',
  USER_EMAILS: 'USER_EMAILS',
  PROS: 'PROS',
};

export const USER_EVENTS = {
  USER_CREATED: 'USER_CREATED',
};
