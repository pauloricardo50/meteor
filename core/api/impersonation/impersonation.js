import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const APP_URL = Meteor.settings.public.subdomains.app;

export const IMPERSONATE_ROUTE = '/impersonate';
export const IMPERSONATE_USER_ID = 'userId';
export const IMPERSONATE_TOKEN = 'authToken';
export const IMPERSONATE_SESSION_KEY = 'impersonate';

export function generateImpersonateLink(userId) {
  // eslint-disable-next-line no-underscore-dangle
  const token = Accounts._storedLoginToken();
  const queryString = `${IMPERSONATE_USER_ID}=${userId}&${IMPERSONATE_TOKEN}=${token}`;

  return `${APP_URL}${IMPERSONATE_ROUTE}?${queryString}`;
}
