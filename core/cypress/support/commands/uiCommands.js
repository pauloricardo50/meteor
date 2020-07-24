import 'cypress-file-upload';

Cypress.Commands.add('routeShouldExist', expectedPageUri => {
  // make sure the page's route exist (doesn't get redirected to the not-found page)
  // Note: it can get redirected on componentDidMount - that's not tested here
  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});

Cypress.Commands.add(
  'routeShouldRenderSuccessfully',
  (routeConfig, testData, options = {}) => {
    const pageRoute =
      typeof routeConfig === 'function' ? routeConfig(testData) : routeConfig;

    const {
      uri,
      options: {
        shouldRender: expectedDomElement,
        shouldContain,
        dropdownShouldRender,
      },
    } = pageRoute;

    if (options.reloadWindowOnNavigation) {
      // this is used for navigating on a static router/website
      cy.visit(uri);
    } else {
      cy.routeTo(uri);
    }

    cy.routeShouldExist(uri);
    if (expectedDomElement) {
      cy.get(expectedDomElement).should('exist');
    }
    if (shouldContain) {
      cy.contains(shouldContain).should('exist');
    }
    if (dropdownShouldRender) {
      cy.dropdownShouldRender(dropdownShouldRender);
    }
  },
);

// select dropdown items and check if what we want gets rendered
Cypress.Commands.add('dropdownShouldRender', dropdownAssertionConfig => {
  Object.keys(dropdownAssertionConfig).forEach(dropdownSelector => {
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

Cypress.Commands.add(
  'setSelect',
  { prevSubject: 'optional' },
  (prevSubject, name, value) => {
    if (prevSubject) {
      if (typeof value === 'string') {
        prevSubject.find(`input[name=${name}]`).should('not.be.disabled');
        prevSubject
          .find(`input[name=${name}]`)
          .parent()
          .click()
          .get(`[data-value=${value}]`)
          .click();
      } else {
        prevSubject.find(`input[name=${name}]`).should('not.be.disabled');
        prevSubject
          .find(`input[name=${name}]`)
          .parent()
          .click()
          .get('ul[role=listbox]')
          .children()
          .eq(value)
          .click();
      }
    } else if (typeof value === 'string') {
      cy.get(`input[name=${name}]`).should('not.be.disabled');
      cy.get(`input[name=${name}]`)
        .parent()
        .click()
        .get(`[data-value=${value}]`)
        .click();
    } else {
      // Support clicking on nth item
      cy.get(`input[name=${name}]`).should('not.be.disabled');
      cy.get(`input[name=${name}]`)
        .parent()
        .click()
        .get('ul[role=listbox]')
        .children()
        .eq(value)
        .click();
    }
  },
);

Cypress.Commands.add('routeTo', path => {
  cy.window().then(({ reactRouterDomHistory }) => {
    reactRouterDomHistory.push(path);
  });
});

// This is helpful to avoid weird issues when starting tests
// Always make sure to `get` something on the page before doing things
// Otherwise meteor methods might time out because of multiple websocket
// connections
Cypress.Commands.add('initiateTest', () => {
  const projectName = Cypress.config('projectName');
  cy.meteorLogout();

  // Visit login page on all microservices except www to start tests
  if (projectName === 'www') {
    cy.visit('/');
  } else {
    cy.visit('/login');
  }

  cy.get('.logo');
});

Cypress.Commands.add('startTest', ({ url = '/' } = {}) => {
  cy.visit(url);
  cy.window().should('have.property', 'appReady', true);
  cy.checkConnection();
});

const clearLocalStorage = () => {
  localStorage.clear();
};
const doNotClearLocalStorage = () => {};

// By default Cypress clears local storage between every spec. We disable Cypress local storage clearing function, so that we can test local storage usage
// TODO after Cypress adds support for lifecycle events use them instead to do it: https://github.com/cypress-io/cypress/issues/686
Cypress.LocalStorage.clear = doNotClearLocalStorage;
// We need own version to manually clear local storage in tests, because above one disables also cy.clearLocalStorage
Cypress.Commands.add('clearLocalStorage', clearLocalStorage);
