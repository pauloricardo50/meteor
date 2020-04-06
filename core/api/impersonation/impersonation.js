import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { ROLES } from 'core/api/users/userConstants';

const APP_URL = Meteor.settings.public.subdomains.app;
const PRO_URL = Meteor.settings.public.subdomains.pro;

export const IMPERSONATE_ROUTE = '/impersonate';
export const IMPERSONATE_USER_ID = 'userId';
export const IMPERSONATE_TOKEN = 'authToken';
export const IMPERSONATE_ADMIN_ID = 'adminId';

export function generateImpersonateLink({ _id: userId, roles }, adminId) {
  // eslint-disable-next-line no-underscore-dangle
  const token = Accounts._storedLoginToken();
  const queryString = `${IMPERSONATE_USER_ID}=${userId}&${IMPERSONATE_TOKEN}=${token}&${IMPERSONATE_ADMIN_ID}=${adminId}`;
  const microserviceUrl = roles.includes(ROLES.USER) ? APP_URL : PRO_URL;

  return `${microserviceUrl}${IMPERSONATE_ROUTE}?${queryString}`;
}
