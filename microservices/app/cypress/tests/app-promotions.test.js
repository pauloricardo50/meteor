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
          loans: { user: { _id: 'user1' }, $metadata: { invitedBy: 'pro1' } },
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
    cy.contains('Démarrer').click();
    cy.contains('Test promotion').click();
    cy.setSelect('residenceType', 1);

    cy.get('.promotion-lots-table tbody tr').should('have.length', 2);

    cy.get('.promotion-lots-table input[type=checkbox]').first().check();

    cy.get('.promotion-options-table tbody tr').should('have.length', 1);

    cy.get('.promotion-lots-table input[type=checkbox]:checked')
      .first()
      .uncheck();

    cy.contains('Vous devez choisir au moins un lot').should('exist');

    cy.get('.promotion-lots-table input[type=checkbox]:not(:checked)').check();

    cy.get('.promotion-options-table tbody tr').should('have.length', 2);

    cy.contains('button', 'Réserver').first().click();
    cy.contains('Confirmer').click();
    cy.contains('Réservation en cours').should('exist');
  });
});
