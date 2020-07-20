import pollUntilReady from '../../../utils/pollUntilReady';
import { USER_EMAIL, USER_PASSWORD } from '../../server/e2eConstants';
// import { E2E_USER_EMAIL, USER_PASSWORD } from '../../utils';

// Be careful, if methods don't come back, you might be creating a new
// websocket connection, see the network tab if you have multiple ones
// https://github.com/meteor/meteor/issues/10392
// This hardcore retry function makes sure we have highly reliable tests
// as it'll end up succeeding once the websocket connection has stablized
const tryUntilSucceed = func =>
  new Promise((resolve, reject) => {
    pollUntilReady(
      () =>
        new Promise((res2, rej2) => {
          const timeout = setTimeout(() => {
            // Sometimes the isLoggedIn call never reaches the server
            // To avoid this, add a timeout that skips this specific call
            res2(false);
          }, 40);

          func((error, result) => {
            clearTimeout(timeout);
            if (error) {
              rej2(error);
            }

            res2(result);
          });
        }),
    )
      .then(resolve)
      .catch(reject);
  });

// You have to have visited the app before this can work
// Like: cy.visit('/')
Cypress.Commands.add('getMeteor', () =>
  cy.window().then(window => {
    if (!window.Meteor) {
      // https://github.com/cypress-io/cypress/issues/4249
      return null;
    }

    return window.Meteor;
  }),
);

Cypress.Commands.add('callMethod', (method, ...params) => {
  Cypress.log({
    name: 'Calling method',
    consoleProps: () => ({ name: method, params }),
  });

  return cy.getMeteor().then(
    Meteor =>
      new Cypress.Promise(resolve => {
        Meteor.apply(method, params, (err, result) => {
          if (err) {
            // It would be great if you could catch cypress.Promise errors..
            // But for now you have to resolve, or it fails the test
            resolve(err);
            return;
          }

          resolve(result);
        });
      }),
  );
});

Cypress.Commands.add('meteorLogout', () => {
  cy.getMeteor().then(
    Meteor =>
      new Cypress.Promise((resolve, reject) => {
        if (!Meteor) {
          return resolve();
        }

        tryUntilSucceed(callback => Meteor.logout(callback))
          .then(() => resolve(true))
          .catch(reject);
      }),
  );
});

Cypress.Commands.add(
  'meteorLogin',
  (email = USER_EMAIL, password = USER_PASSWORD) => {
    Cypress.log({
      name: 'Logging in',
      consoleProps: () => ({ email, password }),
    });

    cy.getMeteor().then(Meteor => {
      let promise;

      if (Meteor.userId()) {
        console.log('logging out');

        // Logout first if the user is already logged in
        promise = cy.meteorLogout();
      } else {
        console.log('not logged in');
        promise = Promise.resolve();
      }

      return promise.then(
        () =>
          new Cypress.Promise((resolve, reject) => {
            Meteor.loginWithPassword(email, password, err => {
              if (err) {
                return reject(err);
              }

              // We need to make sure we're properly logged in on the server, not only the
              // the client, as they can by out of sync with cypress
              tryUntilSucceed(callback => Meteor.call('isLoggedIn', callback))
                .then(resolve)
                .catch(reject);
            });
          }),
      );
    });
  },
);

// Refetches all non-reactive queries, would require a refresh, so this speeds tests up
Cypress.Commands.add('refetch', () => {
  cy.window().then(({ refetchQueries }) => {
    refetchQueries();
  });
});

Cypress.Commands.add('routeShouldExist', expectedPageUri => {
  // make sure the page's route exist (doesn't get redirected to the not-found page)
  // Note: it can get redirected on componentDidMount - that's not tested here
  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});

// select dropdown items and check if what we want gets rendered
Cypress.Commands.add('dropdownShouldRender', dropdownAssertionConfig => {
  if (!dropdownAssertionConfig) {
    return;
  }

  Object.keys(dropdownAssertionConfig).forEach(dropdownSelector => {
    const items = dropdownAssertionConfig[dropdownSelector];
    items.forEach(({ item: itemSelector, shouldRender }) => {
      cy.selectDropdownOption(dropdownSelector, itemSelector);
      cy.get(shouldRender).should('exist');
    });
  });
});

Cypress.Commands.add(
  'uploadFile',
  { prevSubject: 'element' },
  (subject, fileName) => {
    cy.window().then(window => {
      const blob = new window.Blob(
        [JSON.stringify({ hello: 'world' }, undefined, 2)],
        { type: 'application/pdf' },
      );
      blob.lastModifiedDate = new Date();
      blob.name = fileName;

      cy.wrap(subject).trigger('drop', {
        dataTransfer: {
          files: [blob],
          getData: () => false,
        },
      });
    });
  },
);
