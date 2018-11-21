import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
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

const redirectIfInRoleForOtherApp = (currentUser, app, role) => {
  const inApp = Meteor.settings.public.microservice === app;
  console.log({inApp});
  if (inApp) return;

  const inRole = Roles.userIsInRole(currentUser, role);
  console.log({inRole});
  if (!inRole) return;

  const url = [
    Meteor.settings.public.subdomains[app],
    '/login-token/',
    Accounts._storedLoginToken(),
  ];

  window.location.replace(url.join(''));
};

const getBaseRedirect = (currentUser, pathname) => {
  if (!currentUser) {
    return isOnAllowedRoute(pathname, WITHOUT_LOGIN)
      ? false
      : `/login?path=${pathname}`;
  }

  const isDev = Roles.userIsInRole(currentUser, ROLES.DEV);
  if (isDev) return false;

  redirectIfInRoleForOtherApp(currentUser, 'app', ROLES.USER);
  redirectIfInRoleForOtherApp(currentUser, 'pro', ROLES.PRO);
};

export default getBaseRedirect;
