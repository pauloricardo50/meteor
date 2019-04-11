/* eslint-env mocha */
import { USER_EMAIL, USER_PASSWORD } from '../appE2eConstants';

describe('App onboarding', () => {
  [
    { name: 'desktop', someString: 'yo' },
    // { width: 320, height: 568, name: 'iPhone 5' },
  ].forEach(({ width, height, name }) => {
    context(name, () => {
      before(() => {
        cy.initiateTest();
        cy.callMethod('resetDatabase');
      });

      beforeEach(() => {
        cy.callMethod('removeTestUser', USER_EMAIL);
        if (width && height) {
          cy.viewport(width, height);
        }
      });

      it('should login with the login token', () => {
        cy.callMethod('inviteTestUser').then((loginToken) => {
          cy.visit(`/enroll-account/${loginToken}`);
        });

        cy.get('.password-reset-page').contains('Test User');

        cy.get('input')
          .eq(0)
          .type(USER_PASSWORD);
        cy.get('input')
          .eq(1)
          .type(`${USER_PASSWORD}{enter}`);

        cy.url().should('include', '/loans/');
      });

      it('should not be able to login with the token twice', () => {
        cy.visit('/enroll-account/unknown-token');
        cy.get('.error').should('exist');
      });

      it.only('should see the welcomescreen and get to the dashboard', () => {
        cy.callMethod('inviteTestUser', { withPassword: true });
        cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
        cy.visit('/');
        cy.url().should('include', '/loans/');
        cy.get('.welcome-screen').should('exist');

        cy.get('.welcome-screen-top')
          .find('button')
          .click();

        cy.get('.simple-dashboard-page').should('exist');
      });
    });
  });
});
