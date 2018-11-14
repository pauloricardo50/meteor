import pollUntilReady from '../../../utils/testHelpers/pollUntilReady';
import { E2E_USER_EMAIL, USER_PASSWORD } from '../../utils';

Cypress.Commands.add('getMeteor', () =>
  cy.window().then(({ Meteor }) => {
    if (!Meteor) {
      // We visit the app so that we get the Window instance of the app
      // from which we get the `Meteor` instance used in tests
      cy.visit('/');
      return cy.window().then(({ Meteor: MeteorSecondTry }) => MeteorSecondTry);
    }
    return Meteor;
  }));

Cypress.Commands.add('callMethod', (method, ...params) => {
  Cypress.log({
    name: 'Calling method',
    consoleProps: () => ({
      name: method,
      params,
    }),
  });

  cy.getMeteor().then(Meteor =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call(method, ...params, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    }));
});

Cypress.Commands.add('meteorLogout', () => {
  cy.getMeteor().then(Meteor =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.logout((err) => {
        if (err) {
          return reject(err);
        }

        resolve(true);
      });
    }));
});

const waitForLoggedIn = Meteor =>
  new Promise((resolve, reject) =>
    pollUntilReady(() =>
      new Promise((resolve2, reject2) =>
        Meteor.call('isLoggedIn', (err, userId) => {
          if (err) {
            reject2(err);
          }

          resolve2(userId);
        })))
      .then(resolve)
      .catch(reject));

Cypress.Commands.add(
  'meteorLogin',
  (email = E2E_USER_EMAIL, password = USER_PASSWORD) => {
    Cypress.log({
      name: 'Logging in',
      consoleProps: () => ({ email, password }),
    });

    cy.getMeteor().then((Meteor) => {
      if (Meteor.userId()) {
        return cy.meteorLogout();
      }

      return new Cypress.Promise((resolve, reject) => {
        Meteor.loginWithPassword(email, password, (err) => {
          if (err) {
            return reject(err);
          }

          waitForLoggedIn(Meteor)
            .then(resolve)
            .catch(reject);
        });
      });
    });
  },
);

// Refetches all non-reactive queries, would require a refresh, so this speeds tests up
Cypress.Commands.add('refetch', () => {
  cy.window().then(({ activeQueries = [], ClientEventService }) => {
    activeQueries.forEach((query) => {
      ClientEventService.emit(query);
    });
  });
});
