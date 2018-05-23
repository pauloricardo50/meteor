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
  cy.window().then(({ Meteor }) => {
    if (Meteor.userId()) {
      return new Cypress.Promise((resolve, reject) => {
        Meteor.logout(err => (err ? reject(err) : resolve()));
      }).then(() => {
        // wait the login redirection to be done
        cy.location().should(({ pathname }) => {
          expect(pathname.indexOf('/login')).to.eq(0);
        });
      });
    }
  });
});

Cypress.Commands.add(
  'meteorLogoutAndLogin',
  (email = USER_EMAIL, password = USER_PASSWORD) => {
    cy
      .meteorLogout()
      .window()
      .then(window =>
        new Cypress.Promise((resolve, reject) => {
          const { Meteor } = window;

          return Meteor.loginWithPassword(
            email,
            password,
            loginError => (loginError ? reject(loginError) : resolve(window)),
          );
        }));
  },
);

Cypress.Commands.add('routeShouldExist', (expectedPageUri) => {
  // make sure the page's route exist (doesn't get redirected to the not-found page)
  // Note: it can get redirected on componentDidMount - that's not tested here
  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});

Cypress.Commands.add('setAuthentication', (pageAuthentication) => {
  if (pageAuthentication === 'public') {
    cy.meteorLogout();
  } else {
    cy.meteorLogoutAndLogin(`${pageAuthentication}-1@e-potek.ch`);
  }
});

Cypress.Commands.add(
  'routeShouldRenderSuccessfully',
  (routeConfig, testData, options = {}) => {
    const pageRoute =
      typeof routeConfig === 'function' ? routeConfig(testData) : routeConfig;

    const {
      uri,
      options: { shouldRender: expectedDomElement, dropdownShouldRender },
    } = pageRoute;

    const { reloadWindowOnNavigation } = options;
    if (reloadWindowOnNavigation) {
      cy.visit(uri);
    } else {
      cy.window().then(({ reactRouterDomHistory }) => {
        reactRouterDomHistory.push(uri);
      });
    }

    cy
      .routeShouldExist(uri)
      .get(expectedDomElement)
      .should('exist')

      // select dropdown items and check if what we want gets rendered
      .then(() => {
        if (dropdownShouldRender) {
          Object.keys(dropdownShouldRender).forEach((dropdownSelector) => {
            const items = dropdownShouldRender[dropdownSelector];
            items.forEach(({ item: itemSelector, shouldRender }) => {
              cy.selectDropdownOption(dropdownSelector, itemSelector);
              cy.get(shouldRender).should('exist');
            });
          });
        }
      });
  },
);

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
