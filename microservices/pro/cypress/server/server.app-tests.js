// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import { STEPS } from 'core/api/loans/loanConstants';
import userLoansQueryE2E from 'core/api/loans/queries/userLoansE2E';
import {
  createLoginToken,
  createEmailVerificationToken,
} from 'core/utils/testHelpers/testHelpers';
import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';
import 'core/cypress/server/methods';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({});
