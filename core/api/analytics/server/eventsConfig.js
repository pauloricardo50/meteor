import curryRight from 'lodash/curryRight';
import EVENTS from '../events';

const curryPick = curryRight((obj, keys) =>
  keys.reduce((o, k) => ({ ...o, [k]: obj[k] }), {}));

export const EVENTS_CONFIG = {
  [EVENTS.USER_CREATED]: {
    name: 'User Created',
    transform: curryPick(['userId', 'origin', 'referralId', 'orgReferralId']),
  },
  [EVENTS.USER_LOGGED_IN]: {
    name: 'User Logged in',
  },
  [EVENTS.USER_VERIFIED_EMAIL]: {
    name: 'User Verified',
  },
  [EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED]: {
    name: 'Loan Anonymous loan claimed',
    transform: curryPick(['loanId']),
  },
  [EVENTS.API_CALLED]: {
    name: 'Api Called',
    transform: curryPick(['endpoint', 'result']),
  },
  [EVENTS.LOAN_CREATED]: {
    name: 'Loan Created',
    transform: curryPick([
      'loanId',
      'propertyId',
      'promotionId',
      'referralId',
      'anonymous',
    ]),
  },
  [EVENTS.LOAN_STATUS_CHANGED]: {
    name: 'Loan Status changed',
  },
  [EVENTS.CTA_CLICKED]: {
    name: 'CTA clicked',
    transform: curryPick(['name', 'url', 'route', 'path', 'referrer']),
  },
  [EVENTS.LOAN_MAX_PROPERTY_VALUE_CALCULATED]: {
    name: 'Loan Max property value calculated',
    transform: curryPick([
      'loanId',
      'canton',
      'type',
      'anonymous',
      'proProperty',
      'proPropertyValue',
      'mainMinBorrowRatio',
      'mainMaxBorrowRatio',
      'mainMinPropertyValue',
      'mainMaxPropertyValue',
      'mainMinOrganisationName',
      'mainMaxOrganisationName',
      'secondMinBorrowRatio',
      'secondMaxBorrowRatio',
      'secondMinPropertyValue',
      'secondMaxPropertyValue',
      'secondMinOrganisationName',
      'secondMaxOrganisationName',
      'promotionId',
    ]),
  },
  [EVENTS.LOAN_BORROWERS_INSERTED]: {
    name: 'Loan Borrowers inserted',
    transform: curryPick([
      'loanId, amount',
      'anonymous',
      'proProperty',
      'promotion',
    ]),
  },
  [EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN]: {
    name: 'User Followed impersonating admin',
    transform: curryPick(['adminName', 'adminId']),
  },
};
