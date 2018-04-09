Cypress.Commands.add('eraseTestData', () => {
  cy.meteorLogin('dev-1@e-potek.ch').then(({ Meteor }) => {
    Meteor.call('purgeDatabase', Meteor.userId());
  });
});

Cypress.Commands.add('generateTestData', () => {
  cy.meteorLogin('dev-1@e-potek.ch').then(({ Meteor }) =>
    new Cypress.Promise((resolve) => {
      const data = Meteor.call(
        'generateTestData',
        'dev-1@e-potek.ch',
        (err, data) => {
          if (err) {
            return reject(err);
          }

          resolve(data);
        },
      );
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
  const isLoading = Cypress.$('.loading-container:visible')[0];
  if (isLoading) {
    cy.get('.loading-container').should('not.exist');
  }
});

Cypress.Commands.add('shouldRenderWithoutErrors', () => {
  cy.get('section').should('be.ok');
});
