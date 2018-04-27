const devEmail = 'dev-1@e-potek.ch';
const userEmail = 'user-1@e-potek.ch';
const userPassword = '12345';

Cypress.Commands.add('eraseAndGenerateTestData', () => {
  cy.meteorLogoutAndLogin(devEmail).then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call('purgeDatabase', Meteor.userId(), (err) => {
        if (err) {
          return reject(err);
        }

        return Meteor.call(
          'generateTestData',
          devEmail,
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
  'meteorLogoutAndLogin',
  (email = userEmail, password = userPassword) => {
    cy.visit('/').then(({ Meteor }) =>
      new Cypress.Promise((resolve, reject) => {
        Meteor.logout((err) => {
          if (err) {
            return reject(err);
          }

          return Meteor.loginWithPassword(
            email,
            password,
            loginError => (loginError ? reject(loginError) : resolve()),
          );
        });
      }));
  },
);

// wait for the loader (if any) until it closes
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
