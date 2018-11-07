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

  // TODO: Uncomment this to see the test runner go back to login page
  // it('should start with an empty dashboard', () => {
  //   cy.get('.pro-dashboard-page').contains('Rien à afficher');
  // });

  // it('should add a promotion', () => {
  //   cy.get('.buttons > a').click();
  //   cy.location('pathname').should('eq', '/promotions/new');
  // });
});
