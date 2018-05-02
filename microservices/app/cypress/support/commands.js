import { LOAN_QUERIES } from '../../../../core/api/loans/loanConstants';

Cypress.Commands.add('getTestData', () =>
  cy.window().then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call(
        `named_query_${LOAN_QUERIES.USER_LOANS}`,
        { step: 3 },
        (err, loans) => {
          if (err) {
            return reject(err);
          }

          return resolve(loans[0]);
        });
    })));
