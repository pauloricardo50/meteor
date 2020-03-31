import { ORGANISATION_FEATURES } from '../../imports/core/api/organisations/organisationConstants';
import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Single Insurance Request Page', () => {
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
    // Create a user account
    cy.get('button')
      .contains('Compte')
      .click();
    cy.get('input[name=firstName]').type('John');
    cy.get('input[name=lastName]').type('The tester');
    cy.get('input[name=email]').type('test-insurance@e-potek.ch{enter}');
    cy.url().should('include', '/users/');

    // Create an insuranceRequest, and set assignees
    cy.contains('Dossier assurance').click();
    cy.get('input[name="assigneeLinks.0.percent"]')
      .clear()
      .clear()
      .type('40');
    cy.get('input[name="assigneeLinks.0.isMain"]').uncheck();
    cy.get('button.list-add-field').click();
    cy.setSelect('"assigneeLinks.1._id"', 0);
    cy.get('input[name="assigneeLinks.1.percent"]')
      .clear()
      .type('60');
    cy.get('input[name="assigneeLinks.1.isMain"]').check();
    cy.get('input[name="updateUserAssignee"]').check();
    cy.get('[role="dialog"] form').submit();
    cy.url().should('include', '/insuranceRequests/');

    // Check page is correct
    cy.get('.single-insurance-request-page-header')
      .contains('Prospect')
      .should('exist');
    cy.get('.timeline')
      .contains('Dossier créé')
      .should('exist');
    cy.get('.assignees')
      .children()
      .should('have.length', 2);

    // Check each tab
    cy.get('.core-tabs-top')
      .contains('Assurés')
      .click();
    cy.contains("Aucun assuré pour l'instant").should('exist');

    cy.get('.core-tabs-top')
      .contains('Revenus')
      .click();
    cy.contains('Rien à afficher').should('exist');

    cy.get('.core-tabs-top')
      .contains('Documents')
      .click();
    cy.contains('Autres documents').should('exist');
  });

  it('allows adding tasks and activities', () => {
    // Create insuranceRequest
    cy.callMethod('generateScenario', {
      scenario: { insuranceRequests: {} },
    }).then(({ ids: { insuranceRequests } }) => {
      const [id] = insuranceRequests;
      cy.routeTo(`/insuranceRequests/${id}`);
    });
    cy.url().should('include', '/insuranceRequests/');

    // Add a task
    cy.get('.single-insurance-request-page-tasks button')
      .contains('Tâche')
      .click();
    cy.get('input[name=title]').type('Cypress Task');
    cy.contains('Ok').click();
    cy.get('.tasks-table tr').should('have.length', 2);
    cy.get('.tasks-table')
      .contains('Cypress Task')
      .should('exist');

    // Add activity
    cy.get('.timeline')
      .children()
      .should('have.length', 1);
    cy.get('.single-insurance-request-page button')
      .contains('Activité')
      .click();
    cy.get('input[name=docId]').check();
    cy.get('input[name=title]').type('Cypress Activity');
    cy.setSelect('type', 6);
    cy.get('[role="dialog"] form').submit();
    cy.get('.timeline')
      .children()
      .should('have.length', 2);
    cy.get('.timeline')
      .children()
      .its(1)
      .contains('Cypress')
      .should('exist');
  });

  it.only('can add insurances', () => {
    // Create insuranceRequest
    cy.callMethod('generateScenario', {
      scenario: {
        insuranceRequests: {
          borrowers: { firstName: 'John', lastName: 'Insured' },
        },
        organisations: {
          features: [ORGANISATION_FEATURES.INSURANCE],
          insuranceProducts: { name: 'Product 1' },
        },
      },
    }).then(({ ids: { insuranceRequests } }) => {
      const [id] = insuranceRequests;
      cy.routeTo(`/insuranceRequests/${id}`);
    });
    cy.url().should('include', '/insuranceRequests/');

    // Add an insurance
    cy.get('[tooltip="Ajouter une assurance"]').click();
    cy.setSelect('borrowerId', 0);
  });
});
