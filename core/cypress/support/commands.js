Cypress.Commands.add('eraseTestData', () => {
  cy.meteorLogin('dev-1@epotek.ch').then(({ Meteor }) => {
    Meteor.call('purgeDatabase', Meteor.userId());
  });
});

Cypress.Commands.add('generateTestData', () => {
  cy.meteorLogin('dev-1@epotek.ch').then(({ Meteor }) =>
    new Cypress.Promise((resolve) => {
      const data = Meteor.call(
        'generateTestData',
        'dev-1@epotek.ch',
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
  cy.visit('/', {
    onLoad: ({ Meteor }) =>
      new Cypress.Promise((resolve) => {
        Meteor.logout(() => resolve());
      }),
  });
});

Cypress.Commands.add(
  'meteorLogin',
  (email = 'user-1@epotek.ch', password = '12345') => {
    cy.meteorLogout().then(({ Meteor }) =>
      new Cypress.Promise((resolve, reject) => {
        Meteor.loginWithPassword(
          email,
          password,
          err => (err ? reject() : resolve()),
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

Cypress.Commands.add('shouldRenderWithoutErrors', () => {
  cy.get('section').should('be.ok');
});
