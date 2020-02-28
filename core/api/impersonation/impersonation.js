import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { ROLES } from 'core/api/constants';

const APP_URL = Meteor.settings.public.subdomains.app;
const PRO_URL = Meteor.settings.public.subdomains.pro;

export const IMPERSONATE_ROUTE = '/impersonate';
export const IMPERSONATE_USER_ID = 'userId';
export const IMPERSONATE_TOKEN = 'authToken';
export const IMPERSONATE_ADMIN_ID = 'adminId';

export function generateImpersonateLink(user, adminId) {
  const { _id: userId } = user;
  // eslint-disable-next-line no-underscore-dangle
  const token = Accounts._storedLoginToken();
  const queryString = `${IMPERSONATE_USER_ID}=${userId}&${IMPERSONATE_TOKEN}=${token}&${IMPERSONATE_ADMIN_ID}=${adminId}`;
  const microserviceUrl = Roles.userIsInRole(user, ROLES.USER)
    ? APP_URL
    : PRO_URL;

  return `${microserviceUrl}${IMPERSONATE_ROUTE}?${queryString}`;
}
