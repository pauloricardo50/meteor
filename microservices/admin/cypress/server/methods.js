import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Users from 'core/api/users';
import adminLoansQuery from 'core/api/loans/queries/adminLoans';

// For security reasons, the following conditino is the ONLY
// place where server code related to end to end tests should be added
if (process.env.E2E_SERVER) {
  // remove login rate limits in E2E tests
  Accounts.removeDefaultRateLimit();

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
