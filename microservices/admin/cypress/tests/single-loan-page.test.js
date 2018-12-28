import { expect } from 'chai';
import { ADMIN_EMAIL, USER_PASSWORD } from '../../imports/core/cypress/utils';

describe('Loans', () => {
  before(() => {
    cy.visit('/login');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
  });

  beforeEach(() => {
    cy.routeTo('/login');
    cy.contains('Accédez');
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
    cy.get('input[name=title]').type('Cypress Task{enter}');
    cy.get('.tasks-table').contains('Cypress Task');
  });

  it('should add lenders', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.contains('Prêteurs').click();
    cy.contains('Choisir prêteurs').click();

    cy.get('.lender-picker-dialog')
      .contains('Ajouter')
      .click();
    // Wait for button to toggle to "delete"
    cy.get('.lender-picker-dialog').contains('Supprimer');
    cy.get('.lender-picker-dialog')
      .contains('Ajouter')
      .click();
    cy.contains('Fermer').click();
    cy.get('.lender.card1').then((lenders) => {
      expect(lenders.length).to.equal(2);
    });
  });
});
