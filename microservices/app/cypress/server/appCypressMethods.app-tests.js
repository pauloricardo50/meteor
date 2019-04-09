// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import { STEPS } from 'core/api/loans/loanConstants';
import userLoansE2E from 'core/api/loans/queries/userLoansE2E';
import {
  createLoginToken,
  createEmailVerificationToken,
} from 'core/utils/testHelpers/testHelpers';
import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';
import 'core/cypress/server/methods';
import { E2E_USER_EMAIL } from 'core/cypress/utils';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  getAppEndToEndTestData() {
    const { _id: userId } = Users.findOne({ 'emails.address': E2E_USER_EMAIL });

    const admin = Users.findOne(
      { roles: { $in: [ROLES.ADMIN] } },
      { fields: { _id: 1 } },
    );

    const preparationLoan = userLoansE2E
      .clone({ userId, step: STEPS.SOLVENCY })
      .fetchOne();

    const unownedLoan = userLoansE2E.clone({ owned: false }).fetchOne();

    const adminLoginToken = createLoginToken(admin._id);
    const emailVerificationToken = createEmailVerificationToken(
      userId,
      E2E_USER_EMAIL,
    );

    return {
      preparationLoan,
      unownedLoan,
      adminLoginToken,
      emailVerificationToken,
      userId,
      IMPERSONATE_SESSION_KEY,
    };
  },
});
