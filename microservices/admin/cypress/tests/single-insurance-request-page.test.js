import merge from 'lodash/merge';

import { ORGANISATION_FEATURES } from '../../imports/core/api/organisations/organisationConstants';
import { INSURANCE_PRODUCT_FEATURES } from '../../imports/core/api/insuranceProducts/insuranceProductConstants';
import { COMMISSION_RATES_TYPE } from '../../imports/core/api/commissionRates/commissionRateConstants';
import { GENDER } from '../../imports/core/api/borrowers/borrowerConstants';
import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

const scenario = {
  insuranceRequests: {
    borrowers: {
      firstName: 'John',
      lastName: 'Insured',
      birthDate: '1990-01-01T00:00:00',
      gender: GENDER.F,
    },
    user: {
      _factory: 'user',
      loans: [{}, {}],
    },
  },
  organisations: {
    _id: 'orgId',
    name: 'Org 1',
    features: [ORGANISATION_FEATURES.INSURANCE],
    insuranceProducts: {
      _id: 'prodId',
      name: 'Product 1',
      revaluationFactor: 1,
      features: [
        INSURANCE_PRODUCT_FEATURES.GUARANTEED_CAPITAL,
        INSURANCE_PRODUCT_FEATURES.NON_GUARANTEED_CAPITAL,
      ],
      category: '3A',
    },
    commissionRates: {
      _id: 'rateId',
      type: COMMISSION_RATES_TYPE.PRODUCTION,
      rates: [
        {
          startDate: '01-01',
          rate: 0.2,
          threshold: 0,
        },
      ],
    },
  },
};

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

  it('can add insurances and revenues', () => {
    // Create insuranceRequest
    cy.callMethod('generateScenario', { scenario }).then(
      ({ ids: { insuranceRequests } }) => {
        const [id] = insuranceRequests;
        cy.routeTo(`/insuranceRequests/${id}`);
      },
    );
    cy.url().should('include', '/insuranceRequests/');

    // Add an insurance
    cy.get('[tooltip="Ajouter une assurance"]').click();
    cy.setSelect('borrowerId', 0);
    cy.setSelect('organisationId', 0);
    cy.get('[role="dialog"] label')
      .contains('Produit')
      .should('exist');
    cy.setSelect('insuranceProductId', 0);
    cy.get('input[name="premium"]').type(100);
    cy.get('input[name="premiumFrequency"]')
      .first()
      .check();
    cy.get('input[name="startDate"]').type('2020-01-01');
    cy.contains('Retraite').click();
    cy.get('[role="dialog"] form').submit();

    // Add revenue
    cy.contains('8 160').should('exist');
    cy.get('button')
      .contains('Revenu estimé')
      .click();
    cy.get('[role="dialog"]')
      .contains('Org 1')
      .should('exist');
    cy.get('input[name="expectedAt"]').type('2020-03-01');
    cy.get('[role="dialog"] form').submit();

    // Check revenues
    cy.get('.revenues-table tr').should('have.length', 2);
    cy.get('.revenues-table tr')
      .contains('8 160')
      .should('exist');

    // Check revenues tab
    cy.get('.core-tabs-top')
      .contains('Revenus')
      .click();
    cy.get('.revenues-table tr')
      .contains('8 160')
      .should('exist');
  });

  it('Can link insuranceRequests and loans', () => {
    // Create insuranceRequest
    cy.callMethod('generateScenario', {
      scenario: merge({}, scenario, {}),
    }).then(({ ids: { insuranceRequests } }) => {
      const [id] = insuranceRequests;
      cy.routeTo(`/insuranceRequests/${id}`);
    });
    cy.url().should('include', '/insuranceRequests/');

    // Link existing loan
    cy.contains('Lier un dossier').click();
    cy.get('[role="dialog"] input')
      .its(1)
      .type(' ');
    cy.get('[role="dialog"]')
      .contains('Réutiliser')
      .first()
      .click();

    cy.get('.admin-section .icon-link').should('have.length', 1);
  });
});
