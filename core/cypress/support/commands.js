import pollUntilReady from '../../utils/testHelpers/pollUntilReady';
import {
  DEV_EMAIL,
  E2E_USER_EMAIL,
  USER_PASSWORD,
  getTestUserByRole,
} from '../testHelpers';

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
  cy.window()
    .then(({ Meteor }) =>
      new Cypress.Promise((resolve, reject) => {
        if (!Meteor.userId()) {
          return resolve(false);
        }

        Meteor.logout((err) => {
          if (err) {
            return reject(err);
          }

          resolve(true);
        });
      }))
    .then(loggedOut =>
      cy.get('.login-page').should(($loginPage) => {
        if (loggedOut) {
          expect($loginPage).to.have.length(1);
        }
      }));
});

Cypress.Commands.add('routeShouldExist', (expectedPageUri) => {
  // make sure the page's route exist (doesn't get redirected to the not-found page)
  // Note: it can get redirected on componentDidMount - that's not tested here
  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});

Cypress.Commands.add('setAuthentication', (pageAuthentication) => {
  cy.window().then(({ Meteor }) => {
    if (pageAuthentication === 'public') {
      cy.meteorLogout();
    } else {
      cy.meteorLogoutAndLogin(getTestUserByRole(pageAuthentication));
    }
  });
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
  'meteorLogoutAndLogin',
  (email = E2E_USER_EMAIL, password = USER_PASSWORD) => {
    cy.window().then(({ Meteor }) =>
      new Cypress.Promise((resolve, reject) => {
        Meteor.logout((err) => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      }));

    cy.get('.login-page')
      .then(obj => obj)
      .should('exist');

    cy.window().then(({ Meteor }) => new Cypress.Promise((resolve, reject) => {
      Meteor.loginWithPassword(email, password, (loginError) => {
        if (loginError) {
          reject(loginError);
        }
        waitForLoggedIn(Meteor)
          .then(resolve)
          .catch(reject);
      });
    }));

    cy.window();
  },
);

Cypress.Commands.add(
  'routeShouldRenderSuccessfully',
  (routeConfig, testData, options = {}) => {
    const pageRoute =
      typeof routeConfig === 'function' ? routeConfig(testData) : routeConfig;

    const {
      uri,
      options: { shouldRender: expectedDomElement, dropdownShouldRender },
    } = pageRoute;

    if (options.reloadWindowOnNavigation) {
      // this is used for navigating on a static router/website
      cy.visit(uri);
    } else {
      cy.window().then(({ reactRouterDomHistory }) => {
        // this is used for navigating on a dynamic router
        reactRouterDomHistory.push(uri);
      });
    }

    cy.routeShouldExist(uri);
    cy.get(expectedDomElement).should('exist');
    cy.dropdownShouldRender(dropdownShouldRender);
  },
);

// select dropdown items and check if what we want gets rendered
Cypress.Commands.add('dropdownShouldRender', (dropdownAssertionConfig) => {
  if (!dropdownAssertionConfig) {
    return;
  }

  Object.keys(dropdownAssertionConfig).forEach((dropdownSelector) => {
    const items = dropdownAssertionConfig[dropdownSelector];
    items.forEach(({ item: itemSelector, shouldRender }) => {
      cy.selectDropdownOption(dropdownSelector, itemSelector);
      cy.get(shouldRender).should('exist');
    });
  });
});

Cypress.Commands.add(
  'selectDropdownOption',
  (dropdownSelector, itemSelector) => {
    // open dropdown
    const dropdown = cy.get(dropdownSelector).first();
    dropdown.click();

    // click dropdown option
    dropdown.get(itemSelector).click();
  },
);

Cypress.Commands.add('printTestNameOnServer', (testName) => {
  cy.window().then(({ Meteor }) =>
    new Cypress.Promise((resolve, reject) => {
      Meteor.call(
        'serverLog',
        `Test started: ${testName}`,
        err => (err ? reject(err) : resolve()),
      );
    }));
});
