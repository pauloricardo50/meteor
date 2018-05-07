import { Meteor } from 'meteor/meteor';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import userLoansQuery from 'core/api/loans/queries/userLoans';
import {
  createLoginToken,
  createEmailVerificationToken,
} from 'core/utils/testHelpers/testHelpers';

if (process.env.E2E_SERVER) {
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
