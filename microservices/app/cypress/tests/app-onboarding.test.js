import {
  LOAN_STATUS,
  LOCAL_STORAGE_ANONYMOUS_LOAN,
  PURCHASE_TYPE,
} from '../../imports/core/api/loans/loanConstants';
import { ORGANISATION_FEATURES } from '../../imports/core/api/organisations/organisationConstants';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../../imports/core/api/properties/propertyConstants';
import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  USER_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('App onboarding', () => {
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

  describe('onboarding flows', () => {
    it('should go through onboarding and create an account', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          organisations: {
            features: [ORGANISATION_FEATURES.LENDER],
            lenderRules: {},
          },
        },
      });

      cy.url().should('include', '/onboarding');

      cy.contains('button', 'Nouvelle hypothèque').click();

      cy.url().should('include', 'loans');
      cy.contains(
        'button',
        "Je suis en recherche active d'un logement",
      ).click();
      cy.contains('button', 'Résidence principale').click();
      cy.contains('button', 'Genève').click();
      cy.contains('button', 'Un emprunteur').click();

      cy.get('input[name="borrower1.birthDate"]').type('01011990');
      cy.get('form').submit();

      cy.get('input[name="borrower1.salary"]').type('180000');
      cy.get('form').submit();

      cy.get('input[name="borrower1.bankFortune"]').type('250000');
      cy.get('form').submit();

      cy.url().should('include', 'step=result');
      cy.contains('CHF 1 023 000');

      cy.contains('button', 'Sauvegarder').click();
      cy.get('input[name="email"]').type(USER_EMAIL);
      cy.get('[role=dialog] form').submit();
      cy.url().should('include', 'signup');

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

      cy.url().should('include', 'onboarding');
      cy.contains('button', 'Obtenir mon prêt').click();
      cy.contains('Tableau de Bord').should('exist');
    });

    it('lets you go back and change your answers, then routes you to the latest step', () => {
      cy.url().should('include', '/onboarding');

      cy.contains('button', 'Nouvelle hypothèque').click();

      cy.url().should('include', 'loans');

      cy.contains(
        'button',
        "Je suis en recherche active d'un logement",
      ).click();
      cy.contains('button', 'Résidence principale').click();
      cy.contains('button', 'Genève').click();
      cy.contains('button', 'Un emprunteur').click();

      cy.get('input[name="borrower1.birthDate"]').type('01011990');
      cy.get('form').submit();
      cy.url().should('include', 'step=income');

      cy.contains('button', 'Nature du projet').click();
      cy.url().should('include', 'step=purchaseType');
      cy.contains('button', 'Renouvellement').click();

      cy.get('input[name="borrower1.salary"]').type('180000');
      cy.get('form').submit();

      // Routes back to the propertyValue step
      cy.get('input[name="value"]').type('1000000');
      cy.get('form').submit();

      cy.get('button.list-add-field').click();
      cy.get('input[name="previousLoanTranches.0.value"]').type('800000');
      cy.get('input[name="previousLoanTranches.0.dueDate"]').type('2020-01-01');
      cy.get('input[name="previousLoanTranches.0.rate"]').type('1');
      cy.get('input[name="previousLoanTranches.0.duration"]').type('10');
      cy.get('form').submit();

      cy.url().should('include', 'step=result');
    });

    it('works for pro properties', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          organisations: {
            features: [ORGANISATION_FEATURES.LENDER],
            lenderRules: {},
          },
          users: {
            _factory: ROLES.PRO,
            proProperties: {
              _id: 'proPropertyId',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Chemin Auguste-Vilbert 14',
              value: 1500000,
              description: 'End to end tests suck',
              canton: 'GE',
            },
          },
        },
      });

      cy.routeTo(`?property-id=proPropertyId`);

      cy.contains('Chemin Auguste-Vilbert 14').should('exist');
      cy.contains('1 500 000').should('exist');

      cy.contains('Chemin Auguste-Vilbert 14').click();
      cy.url().should('include', 'properties/proPropertyId');
      cy.contains('button', 'Calculer').click();

      cy.url().should('include', 'onboarding');
      cy.contains('Résidence principale').click();
      cy.url().should('include', 'step=borrowerCount');

      cy.contains('Chemin Auguste-Vilbert 14').click();
      cy.url().should('include', 'properties/proPropertyId');

      cy.contains('button', 'Continuer').should('exist');

      cy.contains('button', 'Retour').click();
      cy.url().should('include', 'onboarding');

      cy.contains('button', 'Un emprunteur').click();
      cy.get('input[name="borrower1.birthDate"]').type('01011990');
      cy.get('form').submit();

      cy.get('input[name="borrower1.salary"]').type('180000');
      cy.get('form').submit();

      cy.get('input[name="borrower1.bankFortune"]').type('250000');
      cy.get('form').submit();

      cy.url().should('include', 'step=result');
      cy.contains('CHF 1 023 000');

      cy.contains('Étudions votre projet').should('exist');

      cy.contains('button', 'Fonds propres').click();
      cy.get('input[name="borrower1.bankFortune"]').clear().type('700000');
      cy.get('form').submit();

      cy.contains('button', 'Recalculer').click();
      cy.contains('Félicitations, tout est bon').should('exist');
      cy.contains('Étudions votre projet').should('not.exist');
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

      cy.routeTo(`?propertyId=userPropertyId`);

      cy.wait(1000);
      cy.contains('Bienvenue sur e-Potek').should('exist');
      cy.contains('Chemin Auguste-Vilbert 14').should('not.exist');
    });

    it('should handle errors in maxPropertyValue calculation', () => {});

    it('should work with old cached anonymous loans', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          loans: {
            _id: 'loanId',
            anonymous: true,
            purchaseType: PURCHASE_TYPE.ACQUISITION,
            residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
          },
        },
      });
      cy.window().then(() => {
        localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, 'loanId');
      });
      cy.routeTo('/');
      cy.url().should('include', 'loans/loanId/onboarding');
      cy.contains('button', 'Nouvelle hypothèque').click();
      cy.contains('button', 'Je vais signer chez le notaire').click();
      // Should skip residenceType as it's already set
      cy.contains('canton').should('exist');
    });

    it('should not fail with old expired anonymous loans, and create a new one', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          loans: {
            _id: 'loanId',
            anonymous: true,
            status: LOAN_STATUS.UNSUCCESSFUL,
          },
          users: {
            _factory: ROLES.PRO,
            proProperties: {
              _id: 'proPropertyId',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Chemin Auguste-Vilbert 14',
              value: 1500000,
              description: 'End to end tests suck',
              canton: 'GE',
            },
          },
        },
      });
      cy.window().then(() => {
        localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_LOAN, 'loanId');
      });
      cy.routeTo('/?property-id=proPropertyId');
      cy.contains('button', 'Calculer').click();
      cy.url().should('include', 'loans');
      cy.url().should('not.include', 'loanId');
      cy.contains('Chemin Auguste').should('exist');
    });
  });

  it('should keep the loan in localstorage after a page refresh', () => {
    cy.url().should('include', '/onboarding');

    cy.contains('button', 'Nouvelle hypothèque').click();
    cy.contains('button', "Je suis en recherche active d'un logement").click();

    cy.url().should('include', 'step=residenceType');

    cy.visit('/');

    cy.contains('Nouvelle hypothèque').should('exist');
    cy.contains("Je suis en recherche active d'un logement").should('exist');
    cy.url().should('include', '/loans/');
  });

  it('localStorage is cleared if the loan is no more available', () => {
    cy.contains('button', 'Nouvelle hypothèque').click();
    cy.url().should('include', '/loans/');

    cy.window().then(window => {
      cy.callMethod('updateLoan', {
        loanId: window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
        object: { status: LOAN_STATUS.UNSUCCESSFUL },
      });
    });

    cy.routeTo('/');
    cy.url().should('include', '/onboarding');
    cy.url().should('not.include', '/loans');
    cy.contains('Bienvenue sur e-Potek');
    cy.window().then(window => {
      const loanId = window.localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      expect(loanId).to.equal(null);
    });
  });

  it(`Should attach an anonymous loan to a new user account`, () => {
    cy.contains('button', 'Nouvelle hypothèque').click();
    cy.contains('button', "Je suis en recherche active d'un logement").click();

    cy.contains('Créez votre compte').click();

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

    cy.contains('Nouvelle hypothèque').should('exist');
    cy.contains("Je suis en recherche active d'un logement").should('exist');
    cy.url().should('include', '/loans/');
  });

  it('should attach an anonymous loan to an existing account', () => {
    cy.callMethod('inviteTestUser', { withPassword: true });
    cy.contains('button', 'Nouvelle hypothèque').click();
    cy.contains('button', "Je suis en recherche active d'un logement").click();

    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
    cy.contains('Dossier anonyme').should('exist');
    cy.wait(1000); // "Detached from the DOM" failure avoidance 
    cy.contains('Ajouter à mon compte').click();
    cy.url().should('include', '/loans/');
    cy.contains('Dossier anonyme').should('not.exist');

    cy.contains('Nouvelle hypothèque').should('exist');
    cy.contains("Je suis en recherche active d'un logement").should('exist');

    cy.get('.onboarding-side-nav .logo-home').click();
    cy.get('.loan-card').should('have.length', 2);
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

    cy.contains('button', 'Nouvelle hypothèque').click();
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

    cy.contains('button', 'Nouvelle hypothèque').click();
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
          organisations: { _id: 'orgId', $metadata: { isMain: true } },
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
      { referredByUserLink: 1, referredByOrganisationLink: 1 },
    ).then(({ referredByUserLink, referredByOrganisationLink }) => {
      expect(referredByUserLink).to.equal('proId');
      expect(referredByOrganisationLink).to.equal('orgId');
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

    cy.contains('button', 'Nouvelle hypothèque').click();

    cy.routeTo(`/?property-id=proPropertyId`);
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');

    cy.contains('Ajouter ce bien').click();
    cy.url().should('include', '/loans/');
    cy.contains('Chemin Auguste-Vilbert 14').should('exist');
  });

  it('should call analytics properly', () => {
    cy.callMethod('resetDatabase'); // Make sure DB is very clean for this test
    cy.callMethod('generateScenario', {
      scenario: {
        organisations: {
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: {},
        },
      },
    });

    cy.url().should('include', '/onboarding');

    cy.contains('button', 'Nouvelle hypothèque').click();

    cy.url().should('include', 'loans');
    cy.contains('button', "J'ai fait une offre").click();
    cy.contains('button', 'Résidence principale').click();
    cy.contains('button', 'Genève').click();

    cy.get('input[name="value"]').type('1000000{enter}');

    cy.contains('button', 'Un emprunteur').click();

    cy.get('input[name="borrower1.birthDate"]').type('01011990');
    cy.get('form').submit();

    cy.get('input[name="borrower1.salary"]').type('180000');
    cy.get('form').submit();

    cy.get('input[name="borrower1.bankFortune"]').type('250000');
    cy.get('form').submit();

    cy.url().should('include', 'step=result');
    cy.contains('CHF 1 023 000');

    cy.callMethod('getMethodLogs', {
      $filters: { name: 'analyticsStartedOnboarding' },
      params: 1,
    }).then(result => {
      expect(result.length).to.equal(0);
    });

    cy.callMethod('getMethodLogs', {
      $filters: { name: 'analyticsOnboardingStep' },
      $options: { sort: { createdAt: 1 } },
      params: 1,
    }).then(result => {
      expect(result.length).to.equal(9);
    });

    // Check refreshing doesn't call analytics again
    cy.visit('/');
    cy.contains('Résultat');
    cy.wait(1000);

    cy.callMethod('getMethodLogs', {
      $filters: { name: 'analyticsStartedOnboarding' },
      $options: { sort: { createdAt: 1 } },
      params: 1,
      result: 1,
    }).then(result => {
      expect(result.length).to.equal(0);
    });
  });

  describe('logged in', () => {
    it('Works for users without loan', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          organisations: {
            features: [ORGANISATION_FEATURES.LENDER],
            lenderRules: {},
          },
          users: {
            _id: 'user1',
            emails: [{ address: USER_EMAIL, verified: true }],
          },
        },
      });
      cy.callMethod('setPassword', {
        userId: 'user1',
        password: USER_PASSWORD,
      });
      cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
      cy.url().should('include', 'onboarding');
      cy.url().should('not.include', 'loans');

      cy.contains('button', 'Nouvelle hypothèque').click();
      cy.url().should('include', 'loans');
      cy.contains('button', "J'ai signé chez le notaire").click();
    });

    it('Works for users with a loan', () => {
      cy.callMethod('generateScenario', {
        scenario: {
          organisations: {
            features: [ORGANISATION_FEATURES.LENDER],
            lenderRules: {},
          },
          users: {
            _id: 'user1',
            emails: [{ address: USER_EMAIL, verified: true }],
            loans: {},
          },
        },
      });
      cy.callMethod('setPassword', {
        userId: 'user1',
        password: USER_PASSWORD,
      });
      cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
      cy.routeTo('/'); // Make sure the user goes to the AppRootPage

      cy.contains('button', 'Nouvelle hypothèque').click();
      cy.url().should('include', 'loans');
      cy.contains('button', "J'ai fait une offre qui a été acceptée").click();
    });
  });
});
§