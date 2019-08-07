/* eslint-env mocha */
import { ROLES } from '../../api/users/userConstants';
import { E2E_USER_EMAIL } from '../../fixtures/fixtureConstants';
import { ADMIN_EMAIL, DEV_EMAIL } from '../server/e2eConstants';

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
