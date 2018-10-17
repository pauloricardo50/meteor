import { Roles } from 'meteor/alanning:roles';

import { ROLES } from '../api/constants';
import { IMPERSONATE_ROUTE } from '../api/impersonation/impersonation';

export const isLogin = path => path.slice(0, 6) === '/login';

const WITHOUT_LOGIN = [
  '/login',
  '/enroll-account',
  '/reset-password',
  IMPERSONATE_ROUTE,
];

export const isOnAllowedRoute = (path, routes) =>
  routes.some(allowedRoute => path.startsWith(allowedRoute));

const getBaseRedirect = (currentUser, pathname) => {
  if (!currentUser) {
    return isOnAllowedRoute(pathname, WITHOUT_LOGIN)
      ? false
      : `/login?path=${pathname}`;
  }

  const userIsDev = Roles.userIsInRole(currentUser, ROLES.DEV);

  if (userIsDev) {
    return false;
  }
};

export default getBaseRedirect;
