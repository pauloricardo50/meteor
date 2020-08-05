/* eslint-env mocha */
import {
  USER_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

const suites = [
  { name: 'desktop', forceNewLineInThisFile: 'yo' },
  { width: 320, height: 568, name: 'iPhone 5' },
];

describe('App onboarding', () => {
  before(() => {
    cy.startTest();
    cy.meteorLogout();
    cy.checkConnection();
    cy.callMethod('resetDatabase');
  });

  beforeEach(() => {
    cy.meteorLogout();
    cy.callMethod('resetDatabase');
    cy.window().then(win => {
      // Reset window property
      win.hideWelcomeScreen = undefined;
    });
  });

  suites.forEach(({ width, height, name }) => {
    context(name, () => {
      beforeEach(() => {
        if (width && height) {
          cy.viewport(width, height);
        }
      });

      it('should login with the login token', () => {
        cy.callMethod('inviteTestUser').then(loginToken => {
          cy.routeTo(`/enroll-account/${loginToken}`);
        });

        cy.contains('.password-reset-page', 'Test User');

        cy.get('[name=newPassword]').type(USER_PASSWORD);
        cy.get('[name=newPassword2]').type(`${USER_PASSWORD}`);
        cy.get('[type="checkbox"]').check();
        cy.get('.password-reset-page').contains('Continuer').click();

        cy.url().should('include', '/loans/');
      });

      it('should not be able to login with the token twice', () => {
        cy.routeTo('/enroll-account/unknown-token');
        cy.url().should('include', '/login');
      });

      it('should see the welcomescreen and get to the dashboard', () => {
        cy.callMethod('inviteTestUser', { withPassword: true });
        cy.routeTo('/');
        cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
        cy.url().should('include', '/loans/');
        cy.get('.welcome-screen').should('exist');

        cy.get('.welcome-screen-top').find('button').click();

        cy.get('.simple-dashboard-page').should('exist');

        cy.get('.borrowers-adder').find('button').first().click();
        cy.contains('.borrowers-card', '29%');

        cy.get('input#birthDate').type('01/03/2018');
        cy.get('input#salary').type('180000');
        cy.get('input#netSalary').type('150000');
        cy.get('#bonusExists [type="radio"]').last().check();
        cy.get('input#bankFortuneSimple').type('250000');

        cy.contains('.borrowers-card', '100%');
      });
    });
  });
});
