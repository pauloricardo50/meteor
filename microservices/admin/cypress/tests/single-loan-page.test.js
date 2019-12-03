import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Single Loan Page', () => {
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

  it('creates and routes to a loan from the dashboard', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.url().should('include', '/loans/');
    cy.contains('Pas de compte');
  });

  it('changes status', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.get('.status-label').should('contain', 'Prospect');
    cy.contains('Prospect').click();
    cy.contains('Qualifié').click({ force: true });

    cy.get('.status-label').should('contain', 'Qualifié');
    cy.contains('Qualifié').click();
    cy.contains('En cours').click({ force: true });

    cy.get('.status-label').should('contain', 'En cours');
    cy.contains('En cours').click();
    cy.contains('Closing').click({ force: true });

    cy.contains('Ok').click();
    cy.get('.status-label').should('not.contain', 'Prospect');
    cy.get('.status-label').should('contain', 'Closing');
  });

  it('should add a task to the loan', () => {
    cy.contains('Nouvelle hypothèque').click();

    cy.get('.tasks-table').should('not.exist');

    cy.get('.single-loan-page-tasks')
      .contains('Ajouter tâche')
      .click();
    cy.get('input[name=title]').type('Cypress Task');
    cy.contains('Ok').click();
    cy.get('.tasks-table tr').should('have.length', 2);
  });

  it('should add lenders', () => {
    cy.contains('Nouvelle hypothèque').click();
    cy.contains('Prospect').click();
    cy.contains('Qualifié').click({ force: true });

    cy.get('.status-label').should('contain', 'Qualifié');
    cy.contains('Qualifié').click();
    cy.contains('En cours').click({ force: true });
    cy.get('.status-label').should('contain', 'En cours');

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

    cy.get('.lender.card1').should('have.length', 2);
  });
});
