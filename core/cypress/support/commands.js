Cypress.Commands.add('eraseAndGenerateTestData', () => {
  cy.meteorLogin('dev-1@e-potek.ch').then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call('purgeDatabase', Meteor.userId(), (err) => {
        if (err) {
          return reject(err);
        }

        return Meteor.call(
          'generateTestData',
          'dev-1@e-potek.ch',
          (generateDataError, data) => {
            if (generateDataError) {
              return reject(generateDataError);
            }

            return resolve(data);
          },
        );
      });
    }));
});

Cypress.Commands.add('meteorLogout', () => {
  cy.visit('/').then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.logout(err => (err ? reject(err) : resolve()));
    }));
});

Cypress.Commands.add(
  'meteorLogin',
  (email = 'user-1@e-potek.ch', password = '12345') => {
    cy
      .meteorLogout()
      .visit('/')
      .then(({ Meteor }) =>
        new Cypress.Promise((resolve, reject) => {
          Meteor.loginWithPassword(
            email,
            password,
            err => (err ? reject(err) : resolve()),
          );
        }));
  },
);

// wait for the loader until it closes and then do further
Cypress.Commands.add('waitUntilLoads', () => {
  const isLoading = Cypress.$('.loading-container')[0];
  if (isLoading) {
    cy.get('.loading-container').should('not.exist');
  }
});

Cypress.Commands.add('shouldRenderWithoutErrors', (expectedPageUri) => {
  cy.get('section').should('be.ok');

  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});
