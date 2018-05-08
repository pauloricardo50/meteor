import { Meteor } from 'meteor/meteor';
import Users from 'core/api/users';
import { ROLES } from 'core/api/users/userConstants';
import adminLoansQuery from 'core/api/loans/queries/adminLoans';

if (process.env.E2E_SERVER) {
  Meteor.methods({
    getEndToEndTestData() {
      const step3Loan = adminLoansQuery
        .clone({ step: 3, owned: true })
        .fetchOne();

      const {
        property,
        borrowers: [borrower],
      } = step3Loan;

      const user = Users.findOne(step3Loan.userId);

      return { step3Loan, user, property, borrower };
    },
  });
}
