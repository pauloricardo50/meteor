import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import userLoansQuery from 'core/api/loans/queries/userLoans';
import {
  createLoginToken,
  createEmailVerificationToken,
} from 'core/utils/testHelpers/testHelpers';

// For security reasons, the following conditino is the ONLY
// place where server code related to end to end tests should be added
if (process.env.E2E_SERVER) {
  // remove login rate limits in E2E tests
  Accounts.removeDefaultRateLimit();

  Meteor.methods({
    getEndToEndTestData() {
      const user = Users.findOne(this.userId);
      const { _id: userId, emails } = user;

      const admin = Users.findOne(
        { roles: { $in: [ROLES.ADMIN] } },
        { fields: { _id: 1 } },
      );

      const step3Loan = userLoansQuery.clone({ userId, step: 3 }).fetchOne();
      const unownedLoan = userLoansQuery
        .clone({ userId, unowned: true })
        .fetchOne();

      const adminLoginToken = createLoginToken(admin._id);
      const emailVerificationToken = createEmailVerificationToken(
        userId,
        emails[0].address,
      );

      return {
        step3Loan,
        unownedLoan,
        adminLoginToken,
        emailVerificationToken,
        userId,
      };
    },
  });
}
