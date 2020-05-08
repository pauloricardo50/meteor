export const APP_ACCESS_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PRO: 'pro',
};

export const ADMIN_ROLES = {
  DEV: 'dev',
  OBSERVER: 'observer',
  ADVISOR: 'advisor',
};

export const ASSIGNABLE_ROLES = {
  ...ADMIN_ROLES,
  USER: APP_ACCESS_ROLES.USER,
  PRO: APP_ACCESS_ROLES.PRO,
};

export const ROLES = {
  ...APP_ACCESS_ROLES,
  ...ADMIN_ROLES,
};
