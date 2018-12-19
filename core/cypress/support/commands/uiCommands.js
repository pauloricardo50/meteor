Cypress.Commands.add('routeShouldExist', (expectedPageUri) => {
  // make sure the page's route exist (doesn't get redirected to the not-found page)
  // Note: it can get redirected on componentDidMount - that's not tested here
  const baseUrl = Cypress.config('baseUrl');
  cy.url().should('eq', baseUrl + expectedPageUri);
});

Cypress.Commands.add(
  'routeShouldRenderSuccessfully',
  (routeConfig, testData, options = {}) => {
    const pageRoute = typeof routeConfig === 'function' ? routeConfig(testData) : routeConfig;

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

Cypress.Commands.add('setSelect', (name, value) => {
  if (typeof value === 'string') {
    cy.get(`input[name=${name}]`)
      .parent()
      .click()
      .get(`[data-value=${value}]`)
      .click();
  } else {
    // Support clicking on nth item
    cy.get(`input[name=${name}]`)
      .parent()
      .click()
      .get('ul[role=listbox]')
      .children()
      .eq(value)
      .click();
  }
});
