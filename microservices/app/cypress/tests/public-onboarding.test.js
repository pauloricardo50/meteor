import {
  LOCAL_STORAGE_ANONYMOUS_LOAN,
  LOAN_STATUS,
} from '../../imports/core/api/loans/loanConstants';
import {
  USER_PASSWORD,
  USER_EMAIL,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Public onboarding', () => {
  before(() => {
    cy.initiateTest();
  });

  beforeEach(() => {
    cy.callMethod('resetDatabase');
    cy.visit('/');
  });

  it('should create a new loan when clicking on a cta', () => {
    cy.get('.welcome-screen').should('exist');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();

    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();

    cy.get('input#firstName').should('not.exist');
    cy.get('input#salary').should('exist');
  });

  it('should keep the loan in localstorage', () => {
    cy.get('.welcome-screen').should('exist');

    cy.get('.welcome-screen-top')
      .find('button')
      .click();

    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();
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
    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      cy.callMethod('updateLoan', {
        loanId: window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
        object: { status: LOAN_STATUS.UNSUCCESSFUL },
      });
    });

    cy.visit('/');
    cy.get('.welcome-screen').should('exist');
    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      expect(loanId).to.equal(null);
    });
  });

  it('should create a new account before revealing maxPropertyValue', () => {
    cy.callMethod('generateProFixtures');
    cy.get('.welcome-screen-top')
      .find('button')
      .click();

    cy.get('.borrowers-adder')
      .find('button')
      .first()
      .click();

    cy.get('input#salary').type('120000');
    cy.get('input#netSalary').type('100000');
    cy.get('input#bankFortune').type('250000');
    cy.wait(500);

    cy.setSelect('max-property-value-canton', 'GE');
    cy.contains('Valider').click();

    cy.contains('Parfait').should('exist');

    cy.get('[name="email"]').type('dev@e-potek.ch{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getLoginToken', 'dev@e-potek.ch').then(loginToken => {
      cy.visit(`/enroll-account/${loginToken}`);
    });

    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10');
    cy.get('[name=newPassword]').type(USER_PASSWORD);
    cy.get('[name=newPassword2]').type(`${USER_PASSWORD}`);
    cy.get('[type="checkbox"]').check();
    cy.get('.password-reset-page')
      .contains('Continuer')
      .click();

    cy.url().should('include', '/loans/');
    cy.get('.max-property-value-results')
      .contains('CHF 798 000')
      .should('exist');
  });

  it('Should attach an anonymous loan to a new user account', () => {
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

    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getLoginToken').then(loginToken => {
      cy.visit(`/enroll-account/${loginToken}`);
    });

    cy.get('[name=newPassword]').type(USER_PASSWORD);
    cy.get('[name=newPassword2]').type(`${USER_PASSWORD}`);
    cy.get('[type="checkbox"]').check();
    cy.get('.password-reset-page')
      .contains('Continuer')
      .click();

    cy.url().should('include', '/loans/');
    cy.contains('Continuer').click();
    cy.get('input#salary').should('have.value', '300');
    cy.get('input#firstName').should('exist');
  });

  it('should ask to create an account if the user wants to go further', () => {
    cy.get('.welcome-screen-top')
      .find('button')
      .click();
    cy.get('.simple-dashboard-page-ctas button')
      .last()
      .click();

    cy.contains('Soyez accompagné').should('exist');
  });

  it('should attach an anonymous loan to an existing account', () => {
    cy.callMethod('inviteTestUser', { withPassword: true });
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
    cy.callMethod('addProProperty').then(propertyId => {
      cy.wrap(propertyId).as('propertyId');
    });

    cy.get('@propertyId').then(propertyId => {
      cy.visit(`/?property-id=${propertyId}`);
    });

    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');

    cy.get('.property-card').click();

    cy.setSelect('residenceType', 0);
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
  });

  it('should not display non-PRO properties', () => {
    cy.callMethod('addUserProperty').then(propertyId => {
      cy.wrap(propertyId).as('propertyId');
    });

    cy.get('@propertyId').then(propertyId => {
      cy.visit(`/?propertyId=${propertyId}`);
    });

    cy.get('.welcome-screen').should('exist');
    cy.contains('Chemin Auguste-Vilbert 14').should('not.exist');
  });

  it('should only create one loan based on a PRO property if logged in', () => {
    cy.callMethod('addProProperty').then(propertyId => {
      cy.wrap(propertyId).as('propertyId');
    });
    cy.callMethod('inviteTestUser', { withPassword: true });

    cy.get('@propertyId').then(propertyId => {
      cy.visit(`/?property-id=${propertyId}`);
    });

    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('1 500 000').should('exist');
    cy.get('.welcome-screen')
      .contains('Login')
      .click();
    cy.get('input[name="email"]').type(USER_EMAIL);
    cy.get('input[name="password"]').type(`${USER_PASSWORD}{enter}`);
    cy.get('@propertyId').then(propertyId => {
      cy.url().should('include', propertyId);
    });
    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');

    cy.get('@propertyId').then(propertyId => {
      cy.visit(`/?property-id=${propertyId}`);
    });

    cy.url().should('include', '/loans/');
  });

  it('should create a loan with a referralId', () => {
    cy.callMethod('addProUser').then(userId => {
      cy.wrap(userId).as('userId');
      cy.visit(`/?ref=${userId}`);
    });

    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      cy.callMethod('getLoan', loanId).then(({ referralId }) => {
        cy.get('@userId').then(userId => {
          expect(referralId).to.equal(userId);
        });
      });
    });
  });

  it('should create a loan without a wrong referralId', () => {
    cy.visit('/?ref=abcdef');
    cy.wait(500);

    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      cy.callMethod('getLoan', loanId).then(({ referralId }) => {
        expect(referralId).to.equal(undefined);
      });
    });
  });

  it('should create an account with referralId', () => {
    cy.callMethod('addProUser').then(userId => {
      cy.wrap(userId).as('userId');
      cy.visit(`/?ref=${userId}`);
    });

    cy.contains('Créez').click();
    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getUser', 'dev@e-potek.ch').then(
      ({ referredByUserLink }) => {
        cy.get('@userId').then(userId => {
          expect(referredByUserLink).to.equal(userId);
        });
      },
    );
  });

  it('should create an account with organisation referralId', () => {
    cy.callMethod('addOrganisation').then(orgId => {
      cy.wrap(orgId).as('orgId');
      cy.visit(`/?ref=${orgId}`);
    });

    cy.contains('Créez').click();
    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10');
    cy.contains('Ok').click();

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getUser', 'dev@e-potek.ch').then(
      ({ referredByOrganisationLink }) => {
        cy.get('@orgId').then(orgId => {
          expect(referredByOrganisationLink).to.equal(orgId);
        });
      },
    );
  });

  it('should not let override the referralId with an invalid one', () => {
    cy.callMethod('addProUser').then(userId => {
      cy.wrap(userId).as('userId');
      cy.visit(`/?ref=${userId}`);
      cy.wait(500);
    });

    cy.visit('/?ref=abcdef');
    cy.wait(500);

    cy.contains('Créez').click();
    cy.get('[name="firstName"]').type('Jean');
    cy.get('[name="lastName"]').type('Dujardin');
    cy.get('[name="email"]').type('dev@e-potek.ch');
    cy.get('[name="phoneNumber"]').type('+41 22 566 01 10{enter}');

    cy.url().should('include', '/signup/dev@e-potek.ch');
    cy.get('.signup-success').should('exist');

    cy.callMethod('getUser', 'dev@e-potek.ch').then(
      ({ referredByUserLink }) => {
        cy.get('@userId').then(userId => {
          expect(referredByUserLink).to.equal(userId);
        });
      },
    );
  });

  it('should not route to an existing loan if a new property is expected', () => {
    cy.callMethod('inviteTestUser', { withPassword: true });
    cy.callMethod('addProProperty').then(propertyId => {
      cy.wrap(propertyId).as('propertyId');
    });
    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
    cy.visit('/');
    cy.url().should('include', '/loans/');
    cy.get('[type="checkbox"]').check();
    cy.contains('Démarrer').click();
    cy.contains('Seul').click();
    cy.get('input#salary').type('300');
    // Wait for form save
    cy.wait(500);

    cy.get('@propertyId').then(propertyId => {
      cy.visit(`/?property-id=${propertyId}`);
    });
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
    cy.contains('Démarrer').click();
    cy.url().should('include', '/loans/');

    cy.get('.logo-home').click();

    cy.get('.loan-card').should('have.length', 2);
  });
});
