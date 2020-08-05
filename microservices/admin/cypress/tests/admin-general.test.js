import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Admin general', () => {
  before(() => {
    cy.startTest({ url: '/login' });
    cy.meteorLogout();
    cy.contains('Accédez à votre compte');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateScenario', {
      scenario: {
        users: [
          {
            _id: 'advisor1',
            _factory: ROLES.ADVISOR,
            emails: [{ address: ADMIN_EMAIL, verified: true }],
            firstName: 'Zinédine',
            lastName: 'Zidane',
          },
          { _factory: ROLES.ADVISOR },
        ],
        organisations: { name: 'Pro org' },
      },
    });
    cy.callMethod('setPassword', {
      userId: 'advisor1',
      password: USER_PASSWORD,
    });
    cy.meteorLogin(ADMIN_EMAIL, USER_PASSWORD);
  });

  beforeEach(() => {
    cy.routeTo('/');
  });

  it('shows available advisors on the dashboard', () => {
    cy.contains('Admin Dashboard').should('exist');
    cy.contains('Round-robin')
      .parent()
      .find('.advisor')
      .should('have.length', 2);
  });

  it('searches the DB after hitting space', () => {
    cy.contains('Admin Dashboard').should('exist');
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('body').type(' ');
    cy.get('[role="dialog"]').should('exist');

    cy.focused().type('zidane');
    cy.get('[role="dialog"]')
      .contains('a', 'Zinédine Zidane Conseiller')
      .should('exist');
    cy.get('body').type('{esc}');
  });

  it('can mark an advisor as unavailable', () => {
    cy.contains('Round-robin')
      .parent()
      .find('.advisor')
      .should('have.length', 2);

    cy.get('.advisor').first().click();
    cy.url().should('include', '/users/');
    cy.get('input[name=roundRobinTimeout]').type('Gone');
    cy.contains('dans la boite');

    cy.routeTo('/');

    cy.contains('Round-robin')
      .parent()
      .find('.advisor')
      .should('have.length', 1);
    cy.contains('Pas dispo').parent().find('.advisor').should('have.length', 1);
  });

  it('can create a new user', () => {
    cy.contains('button', 'Compte').click();
    cy.get('input[name=firstName]').type('John');
    cy.get('input[name=lastName]').type('The tester');
    cy.get('input[name=email]').type('new-user-1@e-potek.ch');
    cy.setSelect('referredByOrganisationId', 0);
    cy.setSelect('assignedEmployeeId', 3);
    cy.setSelect('status', 1);
    cy.get('[role="dialog"] form').submit();

    cy.url().should('include', '/users/');
    cy.contains('Pro org').should('exist');
  });

  it('creates a new user with both referredByUser and referredByOrg automatically', () => {
    cy.contains('button', 'Compte').click();
    cy.get('input[name=firstName]').type('John');
    cy.get('input[name=lastName]').type('The tester');
    cy.get('input[name=email]').type('new-user-2@e-potek.ch');
    cy.setSelect('referredByUserId', 1);
    cy.setSelect('assignedEmployeeId', 3);
    cy.setSelect('status', 1);

    cy.get('[role="dialog"] form').submit();

    cy.url().should('include', '/users/');
    cy.contains('Referral Pro').parent().get('.icon-link').should('exist');
    cy.contains('Referral Pro organisation')
      .parent()
      .get('.icon-link')
      .should('exist');
  });
});
