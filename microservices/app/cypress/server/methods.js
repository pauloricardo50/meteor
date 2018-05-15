import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import { AUCTION_STATUS } from 'core/api/loans/loanConstants';
import userLoansQuery from 'core/api/loans/queries/userLoans';
import {
  createLoginToken,
  createEmailVerificationToken,
} from 'core/utils/testHelpers/testHelpers';
import { IMPERSONATE_SESSION_KEY } from 'core/api/impersonation/impersonation';

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

      const step3LoanWithNoAuction = userLoansQuery
        .clone({ userId, step: 3, auction: 'none' })
        .fetchOne();

      const step3LoanWithStartedAuction = userLoansQuery
        .clone({ userId, step: 3, auction: 'started' })
        .fetchOne();

      const step3LoanWithEndedAuction = userLoansQuery
        .clone({ userId, step: 3, auction: 'ended' })
        .fetchOne();

      const unownedLoan = userLoansQuery
        .clone({ userId, unowned: true })
        .fetchOne();

      const adminLoginToken = createLoginToken(admin._id);
      const emailVerificationToken = createEmailVerificationToken(
        userId,
        emails[0].address,
      );

      return {
        step3LoanWithEndedAuction,
        step3LoanWithStartedAuction,
        step3LoanWithNoAuction,
        unownedLoan,
        adminLoginToken,
        emailVerificationToken,
        userId,
        IMPERSONATE_SESSION_KEY,
      };
    },
  });
}
