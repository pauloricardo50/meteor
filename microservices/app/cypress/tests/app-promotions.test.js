import { ORGANISATION_FEATURES } from '../../imports/core/api/organisations/organisationConstants';
import { PROMOTION_STATUS } from '../../imports/core/api/promotions/promotionConstants';
import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  USER_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('App Promotions', () => {
  before(() => {
    cy.startTest();
    cy.meteorLogout();
    cy.checkConnection();
    cy.callMethod('resetDatabase');
    cy.callMethod('generateScenario', {
      scenario: {
        organisations: {
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: {},
        },
        users: [
          {
            _id: 'user1',
            emails: [{ address: USER_EMAIL, verified: true }],
          },
        ],
        promotions: {
          name: 'Test promotion',
          status: PROMOTION_STATUS.OPEN,
          properties: [
            { _id: 'prop1', name: 'A1', value: 1000000 },
            { _id: 'prop2', name: 'A2', value: 1000000 },
          ],
          promotionLots: [
            { _id: 'pLot1', propertyLinks: [{ _id: 'prop1' }] },
            { propertyLinks: [{ _id: 'prop2' }] },
          ],
          users: [
            {
              _id: 'pro1',
              _factory: ROLES.PRO,
              emails: [{ address: 'broker1@e-potek.ch', verified: true }],
              organisations: { _id: 'org1', $metadata: { isMain: true } },
            },
          ],
          loans: {
            user: { _id: 'user1' },
            $metadata: { invitedBy: 'pro1' },
            residenceType: null,
          },
        },
      },
    });
    cy.callMethod('setPassword', { userId: 'user1', password: USER_PASSWORD });
    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
  });

  beforeEach(() => {
    cy.routeTo('/');
  });

  it('should add promotionOptions and start a reservation', () => {
    cy.contains('Bienvenue sur e-Potek').should('exist');
    cy.contains('Test promotion').should('exist');
    cy.contains('button', 'Calculer').click();
    cy.contains('button', 'Résidence principale').click();

    cy.contains('Test promotion').click();

    cy.get('.promotion-lots-table tbody tr').should('have.length', 2);

    cy.get('.promotion-lots-table input[type=checkbox]').first().check();

    cy.get('.promotion-options-table tbody tr').should('have.length', 1);
    cy.wait(1000);

    cy.get('.promotion-lots-table input[type=checkbox]:checked')
      .first()
      .uncheck();

    cy.contains('Vous devez choisir au moins un lot').should('exist');

    cy.get('.promotion-lots-table input[type=checkbox]:not(:checked)').check();

    cy.get('.promotion-options-table tbody tr').should('have.length', 2);
    cy.wait(1000);

    cy.contains('button', 'Réserver').first().click();
    cy.contains('Confirmer').click();
    cy.contains('Réservation en cours').should('exist');

    cy.contains('button', 'Continuer').click();
    cy.url().should('include', 'onboarding');
    cy.contains('Lot A1').should('exist');

    cy.contains('button', 'Un emprunteur').click();

    cy.get('input[name="borrower1.birthDate"]').type('1990-01-01');
    cy.get('form').submit();

    cy.get('input[name="borrower1.salary"]').type('180000');
    cy.get('form').submit();

    cy.get('input[name="borrower1.bankFortune"]').type('250000');
    cy.get('form').submit();

    cy.contains('Découvrez votre capacité de financement').should('exist');
  });
});
