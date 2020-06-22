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
    cy.contains('button', 'Hypothèque').click();
    cy.contains('button', 'Acquisition').click();
    cy.url().should('include', '/loans/');
    cy.contains('Pas de compte');
  });

  it('changes status', () => {
    cy.contains('button', 'Hypothèque').click();
    cy.contains('button', 'Acquisition').click();

    cy.get('.status-label').should('contain', 'Prospect');
    cy.contains('Prospect').click();
    cy.contains('Qualifié').click({ force: true });

    cy.get('.status-label').should('contain', 'Qualifié');
    cy.contains('Qualifié').click();
    cy.contains('En cours').click({ force: true });
    cy.get('input[name=disbursementDate]').last().type('2020-01-01');

    cy.get('.status-label').should('contain', 'En cours');
    cy.contains('En cours').click();
    cy.contains('Closing').click({ force: true });

    cy.contains('Ok').click();
    cy.get('.status-label').should('not.contain', 'Prospect');
    cy.get('.status-label').should('contain', 'Closing');
  });

  it('should add a task to the loan', () => {
    cy.contains('button', 'Hypothèque').click();
    cy.contains('button', 'Acquisition').click();

    cy.get('.tasks-table').should('not.exist');

    cy.contains('.single-loan-page-tasks button', 'Tâche').click();
    cy.get('input[name=title]').type('Cypress Task');
    cy.contains('Ok').click();
    cy.get('.tasks-table tr').should('have.length', 2);
    cy.contains('.tasks-table', 'Cypress Task').should('exist');
  });

  it('should add lenders', () => {
    cy.contains('button', 'Hypothèque').click();
    cy.contains('button', 'Acquisition').click();

    cy.contains('Prospect').click();
    cy.contains('Qualifié').click({ force: true });

    cy.get('.status-label').should('contain', 'Qualifié');
    cy.contains('Qualifié').click();
    cy.contains('En cours').click({ force: true });
    cy.get('input[name=disbursementDate]').last().type('2020-01-01');
    cy.get('.status-label').should('contain', 'En cours');

    cy.contains('Prêteurs').click();
    cy.contains('Choisir prêteurs').click();

    cy.get('.lender-picker-dialog').find('.add').first().click();
    cy.get('.lender-picker-dialog .remove').should('exist');
    cy.get('.lender-picker-dialog').find('.add').first().click();
    cy.contains('Fermer').click();

    cy.get('.lender.card1').should('have.length', 2);
  });

  it('should add files and change their status', () => {
    cy.contains('button', 'Hypothèque').click();
    cy.contains('button', 'Acquisition').click();

    cy.contains('Emprunteurs').click();
    cy.contains('.tab-content button', 'Emprunteur').click();
    cy.contains('Documents').click();

    // Upload 2 files
    cy.get('label[for="IDENTITY"] input[type="file"]')
      .first()
      .attachFile('files/logo.png')
      .attachFile('files/logo2.png');

    cy.get('label[for="IDENTITY"]').contains('logo.png').should('exist');
    cy.get('label[for="IDENTITY"]').contains('logo2.png').should('exist');

    // Change status to error
    cy.get('label[for="IDENTITY"]').contains('Validé').click();

    cy.contains('Non valide').click();

    cy.get('input[name=error]').type('bad file');
    cy.contains('button', 'Ok').click();
    cy.get('label[for="IDENTITY"]').contains('bad file').should('exist');

    cy.get('label[for="IDENTITY"] .title-top svg.error').should('exist');

    // Change error message
    cy.get(
      `label[for="IDENTITY"] button[aria-label="Modifier le message d'erreur"]`,
    ).click();
    cy.get('input[name=error]').clear().type('terrible file');
    cy.contains('button', 'Ok').click();
    cy.get('label[for="IDENTITY"]').contains('terrible file').should('exist');

    // Remove error file
    cy.get(`label[for="IDENTITY"] button[name=delete]`).first().click();
    cy.get('button').contains('Supprimer').click();

    cy.get('label[for="IDENTITY"] .title-top svg.error').should('not.exist');
  });

  it.only('adds closing checklists and manipulates them', () => {
    cy.contains('button', 'Hypothèque').click();
    cy.contains('button', 'Acquisition').click();

    cy.contains('Préparer le closing').should('be.disabled');

    cy.contains('Prospect').click();
    cy.contains('Qualifié').click({ force: true });

    cy.get('.status-label').should('contain', 'Qualifié');
    cy.contains('Qualifié').click();
    cy.contains('En cours').click({ force: true });
    cy.get('input[name=disbursementDate]').last().type('2020-01-01');

    cy.get('.status-label').should('contain', 'En cours');
    cy.contains('En cours').click();
    cy.contains('Closing').click({ force: true });
    cy.get('[role=dialog]').contains('button', 'Ok').click();

    cy.contains('Préparer le closing').should('not.be.disabled');
    cy.contains('Préparer le closing').click();
    cy.contains('Confirmer').click();
    cy.contains('Checklist de closing').click();

    cy.get('.checklist')
      .first()
      .find('.checklist-item')
      .should('have.length', 7);

    cy.get('button[label="Supprimer"]').first().click();
    cy.contains('Confirmer').click();

    cy.get('.checklist')
      .first()
      .find('.checklist-item')
      .should('have.length', 6);
  });
});
