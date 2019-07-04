// For security reasons, this is the ONLY
// file where server code related to end to end tests should be added
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Users from 'core/api/users';
import { adminLoans as adminLoansQuery } from 'core/api/loans/queries';
import 'core/cypress/server/methods';

// remove login rate limits in E2E tests
Accounts.removeDefaultRateLimit();

Meteor.methods({
  getAdminEndToEndTestData() {
    const loan = adminLoansQuery.clone({ owned: true }).fetchOne();

    const {
      properties,
      borrowers: [borrower],
    } = loan;

    const user = Users.findOne(loan.userId);

    return { loan, user, property: properties[0], borrower };
  },
});
