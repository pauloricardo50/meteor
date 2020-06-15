import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Admin general', () => {
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

  it('shows available advisors on the dashboard', () => {
    cy.contains('Dispo')
      .parent()
      .find('.advisor')
      .should('have.length', 4);
  });

  it('searches the DB after hitting space', () => {
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('body').type(' ');
    cy.get('[role="dialog"]').should('exist');

    cy.focused().type('abraha');
    cy.get('[role="dialog"]')
      .contains('a', 'Lydia Abraha Conseiller')
      .should('exist');
  });

  it('can mark an advisor as unavailable', () => {
    cy.get('.advisor')
      .first()
      .click();
    cy.url().should('include', '/users/');
    cy.get('input[name=roundRobinTimeout]').type('Gone');
    cy.contains('dans la boite');

    cy.routeTo('/');

    cy.contains('Dispo')
      .parent()
      .find('.advisor')
      .should('have.length', 3);
    cy.contains('Pas dispo')
      .parent()
      .find('.advisor')
      .should('have.length', 1);
  });

  it('can create a new user', () => {
    cy.contains('button', 'Compte').click();
    cy.get('input[name=firstName]').type('John');
    cy.get('input[name=lastName]').type('The tester');
    cy.get('input[name=email]').type('new-user-1@e-potek.ch');
    cy.setSelect('referredByOrganisationId', 1);
    cy.setSelect('assignedEmployeeId', 3);
    cy.get('[role="dialog"] form').submit();

    cy.url().should('include', '/users/');
    cy.contains('Crédit Suisse').should('exist');
  });

  it('creates a new user with both referredByUser and referredByOrg automatically', () => {
    cy.contains('button', 'Compte').click();
    cy.get('input[name=firstName]').type('John');
    cy.get('input[name=lastName]').type('The tester');
    cy.get('input[name=email]').type('new-user-2@e-potek.ch');
    cy.setSelect('referredByUserId', 1);
    cy.setSelect('assignedEmployeeId', 3);
    cy.get('[role="dialog"] form').submit();

    cy.url().should('include', '/users/');
    cy.contains('Referral Pro')
      .parent()
      .get('.icon-link')
      .should('exist');
    cy.contains('Referral Pro organisation')
      .parent()
      .get('.icon-link')
      .should('exist');
  });
});
