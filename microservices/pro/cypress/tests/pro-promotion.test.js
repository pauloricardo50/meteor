/* eslint-env mocha */
import { PRO_EMAIL, PRO_PASSWORD } from '../constants';

describe('Pro', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateProFixtures');

    cy.url().should('include', 'login');
    cy.get('input[name=email]').type(PRO_EMAIL);
    cy.get('input[name=password]').type(`${PRO_PASSWORD}{enter}`);
    cy.location('pathname').should('eq', '/');
  });

  it('should add a promotion', () => {
    cy.get('.pro-dashboard-page').contains('Rien à afficher');

    cy.get('.buttons > a').click();
    cy.location('pathname').should('eq', '/promotions/new');
  });
});
