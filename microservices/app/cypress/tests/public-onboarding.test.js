import {
  LOAN_STATUS,
  LOCAL_STORAGE_ANONYMOUS_LOAN,
} from '../../imports/core/api/loans/loanConstants';
import { ORGANISATION_FEATURES } from '../../imports/core/api/organisations/organisationConstants';
import { PROPERTY_CATEGORY } from '../../imports/core/api/properties/propertyConstants';
import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  USER_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe.skip('Public onboarding', () => {
  before(() => {
    cy.startTest();
    cy.meteorLogout();
    cy.checkConnection();
    cy.callMethod('resetDatabase');
  });

  beforeEach(() => {
    cy.callMethod('resetDatabase');
    cy.clearLocalStorage();
    cy.meteorLogout();
    cy.routeTo('/');
    cy.checkConnection();
  });

  it('should create a new loan when clicking on a cta', () => {
    cy.get('.welcome-screen').should('exist');

    cy.contains('button', 'Acquisition').click();

    cy.get('.borrowers-adder').find('button').first().click();

    cy.get('input#firstName').should('not.exist');
    cy.get('input#salary').should('exist');
  });

  it('should keep the loan in localstorage after a page refresh', () => {
    cy.get('.welcome-screen').should('exist');

    cy.contains('button', 'Acquisition').click();

    cy.get('.borrowers-adder').find('button').first().click();
    cy.get('input#salary').type('300');
    // Wait for form save
    cy.wait(500);

    cy.visit('/');

    // cy.get('.with-loan-start').should('exist');
    cy.contains('Continuer').click();
    cy.contains('Continuer').click();
    cy.get('input#salary').should('have.value', '300');
  });

  it('localStorage is cleared if the loan is no more available', () => {
    cy.contains('button', 'Acquisition').click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      cy.callMethod('updateLoan', {
        loanId: window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
        object: { status: LOAN_STATUS.UNSUCCESSFUL },
      });
    });

    cy.routeTo('/');
    cy.get('.welcome-screen').should('exist');
    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      expect(loanId).to.equal(null);
    });
  });

  it(`should create a new account before revealing maxPropertyValue`, () => {
    cy.callMethod('generateScenario', {
      scenario: {
        organisations: {
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: {},
        },
      },
    });
    cy.contains('button', 'Acquisition').click();

    cy.get('.borrowers-adder').find('button').first().click();

    cy.get('input#salary').type('120000');
    cy.get('input#netSalary').type('100000');
    cy.get('input#bankFortuneSimple').type('250000');
    cy.wait(500);

    cy.setSelect('max-property-value-canton', 'GE');
    cy.contains('Valider').click();

    cy.contains('Parfait').should('exist');

    cy.get('[name="email"]').type('dev@e-potek.ch{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getLoginToken', 'dev@e-potek.ch').then(loginToken => {
      cy.routeTo(`/enroll-account/${loginToken}`);
    });

    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10');
    cy.get('[name=newPassword]').type(USER_PASSWORD);
    cy.get('[name=newPassword2]').type(`${USER_PASSWORD}`);
    cy.get('[type="checkbox"]').check();
    cy.contains('button', 'Continuer').click();

    cy.url().should('include', '/loans/');
    cy.contains('.max-property-value-results', 'CHF 798 000').should('exist');
  });

  it(`Should attach an anonymous loan to a new user account`, () => {
    cy.contains('button', 'Acquisition').click();

    cy.get('.borrowers-adder').find('button').first().click();

    cy.get('input#salary').type('300');
    cy.wait(500);
    cy.contains('Créez').click();

    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getLoginToken', 'dev@e-potek.ch').then(loginToken => {
      cy.routeTo(`/enroll-account/${loginToken}`);
    });

    cy.get('[name=newPassword]').type(USER_PASSWORD);
    cy.get('[name=newPassword2]').type(`${USER_PASSWORD}`);
    cy.get('[type="checkbox"]').check();
    cy.contains('button', 'Continuer').click();

    cy.url().should('include', '/loans/');
    cy.contains('Continuer').click();
    cy.get('input#salary').should('have.value', '300');
    cy.get('input#firstName').should('exist');
  });

  it('should ask to create an account if the user wants to go further', () => {
    cy.contains('button', 'Acquisition').click();
    cy.get('.simple-dashboard-page-ctas button').last().click();

    cy.contains('Soyez accompagné').should('exist');
  });

  it('should attach an anonymous loan to an existing account', () => {
    cy.callMethod('inviteTestUser', { withPassword: true });
    cy.contains('button', 'Acquisition').click();

    cy.get('.borrowers-adder').find('button').first().click();
    cy.get('input#salary').type('300');
    cy.wait(500);
    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
    cy.url().should('include', '/loans/');
    cy.contains('Dossier anonyme').should('exist');
    cy.contains('Ajouter à mon compte').click();
    cy.url().should('include', '/loans/');
    cy.contains('Dossier anonyme').should('not.exist');
    cy.contains('.borrowers-progress', '300').should('exist');

    cy.get('.logo-home').click();
    cy.get('.loan-card').should('have.length', 2);
  });

  it('should create a loan based on a PRO property', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        users: {
          _factory: ROLES.PRO,
          proProperties: {
            _id: 'proPropertyId',
            category: PROPERTY_CATEGORY.PRO,
            address1: 'Chemin Auguste-Vilbert 14',
            value: 1500000,
          },
        },
      },
    });

    cy.routeTo(`/?property-id=proPropertyId`);

    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
    cy.contains('button', 'Démarrer').click();
    cy.url().should('include', '/loans/');

    cy.get('.property-card').click();

    cy.setSelect('residenceType', 1);
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
  });

  it('should not display non-PRO properties', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        properties: {
          _id: 'userPropertyId',
          category: PROPERTY_CATEGORY.PRO,
          address1: 'Chemin Auguste-Vilbert 14',
          value: 1500000,
        },
      },
    });

    cy.routeTo(`/?propertyId=userPropertyId`);

    cy.get('.welcome-screen').should('exist');
    cy.contains('Chemin Auguste-Vilbert 14').should('not.exist');
  });

  it('should only create one loan based on a PRO property if logged in', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        users: {
          _factory: ROLES.PRO,
          proProperties: {
            _id: 'proPropertyId',
            category: PROPERTY_CATEGORY.PRO,
            address1: 'Chemin Auguste-Vilbert 14',
            value: 1500000,
          },
        },
      },
    });
    cy.callMethod('inviteTestUser', { withPassword: true });

    cy.routeTo(`/?property-id=proPropertyId`);

    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
    cy.get('.welcome-screen').contains('Se connecter').click();
    // cy.contains('.welcome-screen', 'Login').click(); // Why no work?
    cy.get('input[name="email"]').type(USER_EMAIL);
    cy.get('input[name="password"]').type(`${USER_PASSWORD}{enter}`);
    cy.url().should('include', 'proPropertyId');
    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');

    cy.routeTo(`/?property-id=proPropertyId`);

    cy.url().should('include', '/loans/');
  });

  it('should create a loan with a referralId', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        users: {
          _id: 'proId',
          _factory: ROLES.PRO,
          organisations: { $metadata: { isMain: true } },
        },
      },
    });

    cy.routeTo(`/?ref=proId`);

    cy.contains('button', 'Acquisition').click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      cy.callMethod('getLoan', loanId, { referralId: 1 }).then(
        ({ referralId }) => {
          expect(referralId).to.equal('proId');
        },
      );
    });
  });

  it('should create a loan without a wrong referralId', () => {
    cy.routeTo('/?ref=abcdef');
    cy.wait(500);

    cy.contains('button', 'Acquisition').click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      cy.callMethod('getLoan', loanId, { referralId: 1 }).then(
        ({ referralId }) => {
          expect(referralId).to.equal(undefined);
        },
      );
    });
  });

  it('should create an account with referralId', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        users: {
          _id: 'proId',
          _factory: ROLES.PRO,
          organisations: { $metadata: { isMain: true } },
        },
      },
    });

    cy.routeTo(`/?ref=proId`);

    cy.contains('Créez').click();
    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod(
      'getUser',
      { 'emails.0.address': 'dev@e-potek.ch' },
      { referredByUserLink: 1 },
    ).then(({ referredByUserLink }) => {
      expect(referredByUserLink).to.equal('proId');
    });
  });

  it('should create an account with organisation referralId', () => {
    cy.callMethod('generateScenario', {
      scenario: { organisations: { _id: 'orgId' } },
    });

    cy.routeTo(`/?ref=orgId`);

    cy.contains('Créez').click();
    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10');
    cy.contains('Ok').click();

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod(
      'getUser',
      { 'emails.0.address': 'dev@e-potek.ch' },
      { referredByOrganisationLink: 1 },
    ).then(({ referredByOrganisationLink }) => {
      expect(referredByOrganisationLink).to.equal('orgId');
    });
  });

  it('should not let override the referralId with an invalid one', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        users: {
          _id: 'proId',
          _factory: ROLES.PRO,
          organisations: { $metadata: { isMain: true } },
        },
      },
    });

    cy.routeTo(`/?ref=proId`);
    cy.wait(500);
    cy.routeTo('/?ref=abcdef');
    cy.wait(500);

    cy.contains('Créez').click();
    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod(
      'getUser',
      { 'emails.0.address': 'dev@e-potek.ch' },
      { referredByUserLink: 1 },
    ).then(({ referredByUserLink }) => {
      expect(referredByUserLink).to.equal('proId');
    });
  });

  it('should not route to an existing loan if a new property is expected', () => {
    cy.callMethod('generateScenario', {
      scenario: {
        users: {
          _factory: ROLES.PRO,
          proProperties: {
            _id: 'proPropertyId',
            category: PROPERTY_CATEGORY.PRO,
            address1: 'Chemin Auguste-Vilbert 14',
            value: 1500000,
          },
        },
      },
    });
    cy.callMethod('inviteTestUser', { withPassword: true });
    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
    cy.url().should('include', '/loans/');
    cy.get('[type="checkbox"]').check();
    cy.contains('Démarrer').click();
    cy.contains('Seul').click();
    cy.get('input#salary').type('300');
    // Wait for form save
    cy.wait(500);

    cy.routeTo(`/?property-id=proPropertyId`);
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');

    cy.get('.logo-home').click();

    cy.get('.loan-card').should('have.length', 2);
  });

  describe('refinancings', () => {
    it('creates a refinancing loan and gets to the end', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          organisations: {
            features: [ORGANISATION_FEATURES.LENDER],
            lenderRules: {},
          },
        },
      });

      cy.contains('button', 'Renouvellement').click();

      cy.contains('Ajouter un bien').click();
      cy.get('[name="value"]').type('1000000');
      cy.setSelect('residenceType', 1);
      cy.get('[name="address1"]').type('Place de neuve 2');
      cy.get('[name="zipCode"]').type('1204');
      cy.setSelect('city', 1);
      cy.get('[name="previousLoanTranches.0.value"]').type('500000');
      cy.get('[name="previousLoanTranches.0.dueDate"]').type('2020-01-01');
      cy.get('[name="previousLoanTranches.0.rate"]').type('0.8');
      cy.get('[name="previousLoanTranches.0.duration"]').type('10');
      cy.get('.list-add-field').click();
      cy.get('[name="previousLoanTranches.1.value"]').type('150000');
      cy.get('[name="previousLoanTranches.1.dueDate"]').type('2020-01-01');
      cy.get('[name="previousLoanTranches.1.rate"]').type('1.2');
      cy.get('[name="previousLoanTranches.1.duration"]').type('5');
      cy.get('[role="dialog"] form').submit();

      cy.get('.borrowers-adder').find('button').first().click();

      cy.get('input#salary').type('170000');
      cy.wait(500);

      cy.contains('Calculer').click();

      cy.contains('Parfait').should('exist');

      cy.get('[name="email"]').type('dev@e-potek.ch{enter}');

      cy.url().should('include', '/signup/dev@e-potek.ch');
      cy.get('.signup-success').should('exist');

      cy.callMethod('getLoginToken', 'dev@e-potek.ch').then(loginToken => {
        cy.routeTo(`/enroll-account/${loginToken}`);
      });

      cy.get('[name="firstName"]').type('Jean');
      cy.get('[name="lastName"]').type('Dujardin');
      cy.get('[name="phoneNumber"]').type('+41 22 566 01 10');
      cy.get('[name=newPassword]').type(USER_PASSWORD);
      cy.get('[name=newPassword2]').type(`${USER_PASSWORD}`);
      cy.get('[type="checkbox"]').check();
      cy.contains('button', 'Continuer').click();

      cy.url().should('include', '/loans/');
      cy.contains('.max-property-value-results-selects', 'Genève').should(
        'exist',
      );
      cy.contains('.max-property-value-results', 'CHF 770 000').should('exist');
      cy.contains('.max-property-value-results', '120 000').should('exist');

      cy.contains('button', 'Afficher détails').click();
      cy.contains('.max-property-value-results', '770 000').should('exist');
      cy.contains('.max-property-value-results', '650 000').should('exist');
      cy.contains('.max-property-value-results', '120 000').should('exist');
    });
  });
});
