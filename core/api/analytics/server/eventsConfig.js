import curryRight from 'lodash/curryRight';
import EVENTS from '../events';

const curryPick = curryRight((obj, keys) =>
  keys.reduce((o, k) => ({ ...o, [k]: obj[k] }), {}));

export const EVENTS_CONFIG = {
  [EVENTS.USER_CREATED]: {
    name: 'User Created',
    transform: curryPick(['userId', 'origin', 'referral']),
  },
  [EVENTS.USER_LOGGED_IN]: {
    name: 'User Logged in',
  },
  [EVENTS.USER_VERIFIED_EMAIL]: {
    name: 'User Verified',
  },
  [EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED]: {
    name: 'Loan Anonymous loan claimed',
    transform: curryPick(['userId', 'origin', 'referral']),
  },
};
