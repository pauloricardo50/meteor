/* eslint-env mocha */
import { USER_EMAIL, USER_PASSWORD } from '../appE2eConstants';

describe('App onboarding', () => {
  [
    { name: 'desktop', someString: 'yo' },
    { width: 320, height: 568, name: 'iPhone 5' },
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
        cy.url().should('include', '/login');
      });

      it('should see the welcomescreen and get to the dashboard', () => {
        cy.callMethod('inviteTestUser', { withPassword: true });
        cy.visit('/');
        cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
        cy.url().should('include', '/loans/');
        cy.get('.welcome-screen').should('exist');

        cy.get('.welcome-screen-top')
          .find('button')
          .click();

        cy.get('.simple-dashboard-page').should('exist');
        cy.get('.borrowers-progress').contains('0%');

        cy.get('.borrowers-progress a').click();
        cy.url().should('include', '/borrowers');

        cy.get('.borrowers-adder')
          .find('button')
          .first()
          .click();

        cy.get('input#firstName').type('Test');
        cy.get('input#lastName').type('User');
        cy.get('input#birthDate').type('01/03/2018');
        cy.get('input#salary').type('180000');
        cy.get('input#netSalary').type('150000');
        cy.get('#bonusExists [type="radio"]')
          .last()
          .check();
        cy.get('#hasOwnCompany [type="radio"]')
          .last()
          .check();
        cy.get('input#bankFortune').type('250000');

        cy.get('.simple-borrowers-page-header').contains('100%');
      });
    });
  });
});
