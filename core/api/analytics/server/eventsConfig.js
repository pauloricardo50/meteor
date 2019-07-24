import curryRight from 'lodash/curryRight';
import EVENTS from '../events';

const curryPick = curryRight((obj, keys) =>
  keys.reduce((o, k) => ({ ...o, [k]: obj[k] }), {}));

export const EVENTS_CONFIG = {
  [EVENTS.USER_CREATED]: {
    name: 'User Created',
    transform: curryPick(['userId', 'origin', 'referralId']),
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
};
