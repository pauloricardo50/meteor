/* eslint-env mocha */
import { PRO_EMAIL, PRO_PASSWORD } from '../constants';

describe('Pro', () => {
  before(() => {
    cy.visit('/');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateProFixtures');
  });

  it('should login', () => {
    cy.url().should('include', 'login');
    cy.get('input[name=email]').type(PRO_EMAIL);
    cy.get('input[name=password]').type(`${PRO_PASSWORD}{enter}`);
    cy.location('pathname').should('eq', '/');
  });

  it('should start with an empty dashboard', () => {
    cy.get('.pro-dashboard-page').contains('Rien à afficher');
  });

  it('should add a promotion', () => {
    cy.get('.buttons > a').click();
    cy.location('pathname').should('eq', '/promotions/new');

    cy.wait(1000);
    cy.location('pathname').should('eq', '/promotions/new');
  });
});
