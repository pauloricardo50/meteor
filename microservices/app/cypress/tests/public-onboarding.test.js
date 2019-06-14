import {
  LOCAL_STORAGE_ANONYMOUS_LOAN,
  LOAN_STATUS,
} from '../../imports/core/api/loans/loanConstants';
import { USER_PASSWORD, USER_EMAIL } from '../appE2eConstants';

describe('Public onboarding', () => {
  before(() => {
    cy.initiateTest();
  });

  beforeEach(() => {
    cy.callMethod('resetDatabase');
  });

  it('should create a new loan when clicking on a cta', () => {
    cy.visit('/');
    cy.get('.welcome-screen').should('exist');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.url().should('include', '/borrowers');
    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();

    cy.get('.simple-borrowers-page').should('exist');
    cy.get('input#firstName').should('not.exist');
    cy.get('input#salary').should('exist');
  });

  it('should keep the loan in localstorage', () => {
    cy.visit('/');
    cy.get('.welcome-screen').should('exist');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.url().should('include', '/borrowers');
    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();
    cy.get('input#salary').type('300');
    // Wait for form save
    cy.wait(500);

    cy.visit('/');

    cy.get('.with-loan-start').should('exist');
    cy.contains('Continuer').click();
    cy.contains('Continuer').click();
    cy.get('input#salary').should('have.value', '300');
  });

  it('localStorage is cleared if the loan is no more available', () => {
    cy.visit('/');
    cy.get('.welcome-screen').should('exist');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.url().should('include', '/borrowers');

    cy.window().then((window) => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      return cy.callMethod('updateLoan', {
        loanId,
        object: { status: LOAN_STATUS.UNSUCCESSFUL },
      });
    });

    cy.visit('/');
    cy.get('.welcome-screen').should('exist');
    cy.window().then((window) => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      expect(loanId).to.equal(null);
    });
  });

  it('Should attach an anonymous loan to a new user account', () => {
    cy.visit('/');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();

    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();

    cy.get('input#salary').type('300');
    cy.wait(500);
    cy.contains('Créez').click();
    cy.get('input[name="firstName"]').type('Jean');
    cy.get('input[name="lastName"]').type('Dujardin');
    cy.get('input[name="email"]').type('dev@e-potek.ch');
    cy.get('input[name="phoneNumbers.0"]').type('+41 22 566 01 10');
    cy.contains('Ok').click();

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getLoginToken').then((loginToken) => {
      cy.visit(`/enroll-account/${loginToken}`);
    });

    cy.get('input')
      .eq(0)
      .type(USER_PASSWORD);
    cy.get('input')
      .eq(1)
      .type(`${USER_PASSWORD}{enter}`);

    cy.url().should('include', '/loans/');
    cy.contains('Continuer').click();
    cy.get('input#salary').should('have.value', '300');
    cy.get('input#firstName').should('exist');
  });

  it('should ask to create an account if the user wants to go further', () => {
    cy.visit('/');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.contains('Tableau de bord').click();
    cy.get('.simple-dashboard-page-ctas button')
      .last()
      .click();

    cy.contains('Soyez accompagné').should('exist');
  });

  it('should attach an anonymous loan to an existing account', () => {
    cy.callMethod('inviteTestUser', { withPassword: true });
    cy.visit('/');
    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();
    cy.get('input#salary').type('300');
    cy.wait(500);
    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
    cy.visit('/');
    cy.url().should('include', '/loans/');
    cy.contains('Dossier anonyme').should('exist');
    cy.contains('Ajouter à mon compte').click();
    cy.url().should('include', '/loans/');
    cy.contains('Dossier anonyme').should('not.exist');
    cy.get('.borrowers-progress')
      .contains('300')
      .should('exist');

    cy.get('.logo-home').click();
    cy.get('.loan-card').should('have.length', 2);
  });

  it('should create a loan based on a PRO property', () => {
    cy.visit('/');
    cy.callMethod('addProProperty').then((propertyId) => {
      cy.wrap(propertyId).as('propertyId');
    });

    cy.get('@propertyId').then((propertyId) => {
      cy.visit(`/?propertyId=${propertyId}`);
    });

    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
    cy.contains('Je veux acquérir').click();
    cy.url().should('include', '/loans/');

    cy.contains('Tableau de bord').click();
    cy.contains('Voir le bien immobilier').click();

    cy.setSelect('residenceType', 0);
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
  });

  it('should not display non-PRO properties', () => {
    cy.visit('/');
    cy.callMethod('addUserProperty').then((propertyId) => {
      cy.wrap(propertyId).as('propertyId');
    });

    cy.get('@propertyId').then((propertyId) => {
      cy.visit(`/?propertyId=${propertyId}`);
    });

    cy.get('.welcome-screen').should('exist');
    cy.contains('Chemin Auguste-Vilbert 14').should('not.exist');
  });
});
