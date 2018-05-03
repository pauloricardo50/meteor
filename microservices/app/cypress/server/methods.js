import { Meteor } from 'meteor/meteor';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import userLoansQuery from 'core/api/loans/queries/userLoans';
import { createLoginToken } from 'core/utils/testHelpers/testHelpers';

if (process.env.E2E_SERVER) {
  Meteor.methods({
    getEndToEndTestData() {
      const { userId } = this;

      const admin = Users.findOne(
        { roles: { $in: [ROLES.ADMIN], $nin: [ROLES.DEV] } },
        { fields: { _id: 1 } },
      );

      return {
        step3Loan: userLoansQuery.clone({ userId, step: 3 }).fetchOne(),
        unownedLoan: userLoansQuery.clone({ userId, unowned: true }).fetchOne(),
        userId,
        adminLoginToken: createLoginToken(admin._id),
      };
    },
  });
}
