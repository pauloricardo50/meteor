import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe.only('Single Insurance Request Page', () => {
  before(() => {
    cy.initiateTest();

    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData', {
      generateAdmins: true,
      generateOrganisations: true,
    });
  });

  beforeEach(() => {
    cy.routeTo('/login');
    cy.get('.login-page');
    cy.meteorLogin(ADMIN_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
  });

  it('creates and routes to an insuranceRequest from the dashboard', () => {
    cy.get('button')
      .contains('Hypothèque')
      .click();
    cy.url().should('include', '/loans/');
    cy.contains('Pas de compte');
  });
});
