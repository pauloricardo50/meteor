import { DEV_EMAIL, USER_EMAIL, USER_PASSWORD } from '../testHelpers';

Cypress.Commands.add('eraseAndGenerateTestData', () =>
  cy.meteorLogoutAndLogin(DEV_EMAIL).then(window =>
    new Cypress.Promise((resolve, reject) => {
      const { Meteor } = window;

      Meteor.call('purgeDatabase', Meteor.userId(), (err) => {
        if (err) {
          return reject(err);
        }

        return Meteor.call(
          'generateTestData',
          DEV_EMAIL,
          (generateDataError, data) => {
            if (generateDataError) {
              return reject(generateDataError);
            }

            return resolve(window);
          },
        );
      });
    })));

/**
 * This command gets the test data that will be passed to the tested routes.
 * It gets the data from the `getEndToEndTestData` method:
 * each microservice should define the `getEndToEndTestData`
 * to return the data it neededs in its end to end tests.
 * SECURITY WARNING:
 *        Make sure the `getEndToEndTestData` method is available ONLY
 *        inside the end to end server and NOT in the regular server
 *        by using the end to end server environment variable!
 */
Cypress.Commands.add('getTestData', (email) => {
  cy.meteorLogoutAndLogin(email).then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call('getEndToEndTestData', {}, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
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
  (email = USER_EMAIL, password = USER_PASSWORD) => {
    cy.visit('/').then(window =>
      new Cypress.Promise((resolve, reject) => {
        const { Meteor } = window;

        Meteor.logout((err) => {
          if (err) {
            return reject(err);
          }

          return Meteor.loginWithPassword(
            email,
            password,
            loginError => (loginError ? reject(loginError) : resolve(window)),
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
  // make sure the page doesn't get redirected by the Router (to login or anywhere else)
  // Note: it can get redirected on componentDidMount - that's not tested here
  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});
