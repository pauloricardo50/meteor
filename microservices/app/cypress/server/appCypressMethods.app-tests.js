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
import 'core/cypress/server/methods';
import { E2E_USER_EMAIL } from 'core/cypress/utils';
import LoanService from 'core/api/loans/server/LoanService';
import UserService from 'core/api/users/server/UserService';
import { USER_EMAIL, USER_PASSWORD } from '../appE2eConstants';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  getAppEndToEndTestData() {
    const { _id: userId } = Users.findOne({ 'emails.address': E2E_USER_EMAIL });

    const admin = Users.findOne(
      { roles: { $in: [ROLES.ADMIN] } },
      { fields: { _id: 1 } },
    );

    const solvencyLoan = userLoansE2E
      .clone({ userId, step: STEPS.SOLVENCY })
      .fetchOne();

    const requestLoan = userLoansE2E
      .clone({ userId, step: STEPS.REQUEST })
      .fetchOne();

    const unownedLoan = userLoansE2E.clone({ owned: false }).fetchOne();

    const adminLoginToken = createLoginToken(admin._id);
    const emailVerificationToken = createEmailVerificationToken(
      userId,
      E2E_USER_EMAIL,
    );

    return {
      solvencyLoan,
      requestLoan,
      unownedLoan,
      adminLoginToken,
      emailVerificationToken,
      userId,
    };
  },
  inviteTestUser({ withPassword } = {}) {
    const userId = UserService.adminCreateUser({
      options: {
        email: USER_EMAIL,
        firstName: 'Test',
        lastName: 'User',
        sendEnrollmentEmail: true,
        password: withPassword && USER_PASSWORD,
      },
    });
    LoanService.adminLoanInsert({ userId });

    const loginToken = UserService.getLoginToken({ userId });
    return loginToken;
  },
  removeTestUser(email) {
    const user = UserService.getByEmail(email);
    if (user) {
      UserService.remove({ userId: user._id });
    }
  },
});
