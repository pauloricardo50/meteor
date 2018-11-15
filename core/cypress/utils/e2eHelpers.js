/* eslint-env mocha */
import { ROLES } from '../../api/users/userConstants';
import { E2E_USER_EMAIL } from '../../fixtures/fixtureConstants';

export const DEV_EMAIL = 'florian@e-potek.ch';
export const ADMIN_EMAIL = 'lydia@e-potek.ch';
export { USER_PASSWORD, E2E_USER_EMAIL } from '../../fixtures/fixtureConstants';

export const route = (uri, options = {}) => ({
  uri,
  options,
});

export const getTestUserByRole = role =>
  ({
    [ROLES.USER]: E2E_USER_EMAIL,
    [ROLES.ADMIN]: ADMIN_EMAIL,
    [ROLES.DEV]: DEV_EMAIL,
  }[role]);
