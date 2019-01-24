import { expect } from 'chai';
import { ADMIN_EMAIL, USER_PASSWORD } from '../../imports/core/cypress/utils';

describe('Loans', () => {
  before(() => {
    cy.initiateTest();

    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
  });

  beforeEach(() => {
    cy.routeTo('/login');
    cy.get('.login-page');
    cy.meteorLogin(ADMIN_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
  });

  it('creates and routes to a loan from the dashboard', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.url().should('include', '/loans/');
    cy.contains("Pas d'utilisateur");
  });

  it('changes status', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.get('.status-label').should('contain', 'Prospect');
    cy.contains('Prospect').click();
    cy.contains('Closing').click();
    cy.get('.status-label').should('not.contain', 'Prospect');
    cy.get('.status-label').should('contain', 'Closing');
  });

  it('should add a task to the loan', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.contains('Ajouter tâche').click();
    cy.get('input[name=title]').type('Cypress Task');
    cy.contains('Ok').click();
    cy.get('.tasks-table').contains('Cypress Task');
  });

  it('should add lenders', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.contains('Prêteurs').click();
    cy.contains('Choisir prêteurs').click();

    cy.get('.lender-picker-dialog')
      .find('.add')
      .first()
      .click();
    cy.get('.lender-picker-dialog .remove').should('exist');
    cy.get('.lender-picker-dialog')
      .find('.add')
      .first()
      .click();
    cy.contains('Fermer').click();

    // Wait for reactive query to come back
    cy.wait(2000);

    cy.get('.lender.card1').then((lenders) => {
      expect(lenders.length).to.equal(2);
    });
  });
});
