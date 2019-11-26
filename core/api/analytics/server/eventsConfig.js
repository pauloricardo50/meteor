import curryRight from 'lodash/curryRight';
import EVENTS from '../events';

const curryPick = curryRight((obj, keys) =>
  keys.reduce((o, k) => ({ ...o, [k]: obj[k] }), {}),
);

export const EVENTS_CONFIG = {
  [EVENTS.USER_CREATED]: {
    name: 'User Created',
    transform: curryPick([
      'userId',
      'origin',
      'referralId',
      'orgReferralId',
      'adminId',
      'ctaId',
    ]),
  },
  [EVENTS.USER_LOGGED_IN]: {
    name: 'User Logged in',
  },
  [EVENTS.USER_VERIFIED_EMAIL]: {
    name: 'User Verified',
  },
  [EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED]: {
    name: 'Loan Anonymous loan claimed',
    transform: curryPick(['loanId', 'loanName']),
  },
  [EVENTS.API_CALLED]: {
    name: 'Api Called',
    transform: curryPick([
      'endpoint',
      'result',
      'startTime',
      'endTime',
      'duration',
      'authenticationType',
      'endpointName',
    ]),
  },
  [EVENTS.LOAN_CREATED]: {
    name: 'Loan Created',
    transform: curryPick([
      'loanId',
      'loanName',
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
      'loanName',
      'canton',
      'type',
      'anonymous',
      'proProperty',
      'proPropertyValue',
      'proPropertyAddress',
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
      'promotionName',
    ]),
  },
  [EVENTS.LOAN_BORROWERS_INSERTED]: {
    name: 'Loan Borrowers inserted',
    transform: curryPick([
      'loanId',
      'loanName',
      'amount',
      'anonymous',
      'proPropertyId',
      'proPropertyAddress',
      'promotionId',
      'promotionName',
    ]),
  },
  [EVENTS.USER_FOLLOWED_IMPERSONATING_ADMIN]: {
    name: 'User Followed impersonating admin',
    transform: curryPick(['adminName', 'adminId']),
  },
  [EVENTS.PRO_INVITED_CUSTOMER]: {
    name: 'Pro Invited customer',
    transform: curryPick([
      'customerId',
      'customerName',
      'customerEmail',
      'proId',
      'proName',
      'proOrganisation',
      'propertyId',
      'propertyAddress',
      'promotionId',
      'promotionName',
      'promotionLotIds',
      'showAllLots',
      'referOnly',
    ]),
  },
  [EVENTS.PRO_INVITED_PRO]: {
    name: 'Pro Invited pro',
    transform: curryPick(['userId', 'proId', 'organisationId']),
  },
  [EVENTS.ADMIN_INVITED_USER]: {
    name: 'Admin Invited user',
    transform: curryPick(['userId', 'adminId']),
  },
};

export const TRACKING_ORIGIN = {
  API: 'API',
  METEOR_METHOD: 'METEOR_METHOD',
};
