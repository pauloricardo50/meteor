// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Users from 'core/api/users';
import { ROLES } from 'core/api/constants';
import 'core/cypress/server/methods';
import { PRO_EMAIL, PRO_PASSWORD } from '../constants';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  generateProFixtures() {
    const userId = Accounts.createUser({
      email: PRO_EMAIL,
      password: PRO_PASSWORD,
    });
    Users.update({ _id: userId }, { $set: { roles: [ROLES.PRO] } });
  },
});
