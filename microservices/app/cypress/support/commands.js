// get the data needed in the app's end to end tests
Cypress.Commands.add('getTestData', () => {
  cy.meteorLogoutAndLogin().then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call('getEndToEndTestData', {}, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      });
    }));
});
