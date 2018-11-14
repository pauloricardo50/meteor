// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

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

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  getAppEndToEndTestData(userEmail) {
    check(userEmail, String);
    const { _id: userId } = Users.findOne({
      'emails.address': userEmail,
    });

    const admin = Users.findOne(
      { roles: { $in: [ROLES.ADMIN] } },
      { fields: { _id: 1 } },
    );

    const preparationLoan = userLoansE2E
      .clone({ userId, step: STEPS.PREPARATION })
      .fetchOne();

    const unownedLoan = userLoansE2E.clone({ owned: false }).fetchOne();

    const adminLoginToken = createLoginToken(admin._id);
    const emailVerificationToken = createEmailVerificationToken(
      userId,
      userEmail,
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
