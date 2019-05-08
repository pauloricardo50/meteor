import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { ROLES } from '../api/constants';
import { IMPERSONATE_ROUTE } from '../api/impersonation/impersonation';

export const isLogin = path => path.slice(0, 6) === '/login';

export const WITHOUT_LOGIN = [
  '/login',
  '/enroll-account',
  '/reset-password',
  '/verify-email',
  IMPERSONATE_ROUTE,
];

export const isOnAllowedRoute = (path, routes) =>
  routes.some(allowedRoute => path.startsWith(allowedRoute));

export const getRedirectIfInRoleForOtherApp = (currentUser, role, app) => {
  const inApp = Meteor.settings.public.microservice === app;
  if (inApp) return;

  const inRole = Roles.userIsInRole(currentUser, role);
  if (!inRole) return;

  const url = [
    Meteor.settings.public.subdomains[app],
    '/login-token/',
    Accounts._storedLoginToken(),
  ];

  return url.join('');
};

const redirectIfInRoleForOtherApp = (...args) => {
  const url = getRedirectIfInRoleForOtherApp(...args);
  if (url) window.location.replace(url);
};

const getBaseRedirect = (currentUser, pathname, withoutLoginRoutes = []) => {
  if (!currentUser) {
    return isOnAllowedRoute(pathname, [...WITHOUT_LOGIN, ...withoutLoginRoutes])
      ? false
      : `/login?path=${pathname}`;
  }

  const isDev = Roles.userIsInRole(currentUser, ROLES.DEV);
  if (isDev) {
    return false;
  }

  // redirectIfInRoleForOtherApp(currentUser, ROLES.USER, 'app');
  // redirectIfInRoleForOtherApp(currentUser, ROLES.PRO, 'pro');
};

export default getBaseRedirect;
