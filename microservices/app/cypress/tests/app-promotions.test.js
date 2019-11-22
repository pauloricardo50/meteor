import {
  USER_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('App Promotions', () => {
  before(() => {
    cy.initiateTest();
    cy.callMethod('resetDatabase');
    cy.callMethod('insertFullPromotion');
    cy.callMethod('inviteTestUser', { toPromotion: true, withPassword: true });
  });

  beforeEach(() => {
    cy.meteorLogin(USER_EMAIL, USER_PASSWORD);
    cy.visit('/');
  });

  it('should add promotionOptions and start a reservation', () => {
    cy.contains('Démarrer').click();
    cy.contains('Pré Polly').click();
    cy.setSelect('residenceType', 1);

    cy.get('.promotion-lots-table table tbody tr').should('have.length', 5);

    cy.get('input[type=checkbox]')
      .first()
      .click();

    cy.get('.promotion-options-table table tbody tr').should('have.length', 1);

    cy.get('input[type=checkbox]')
      .first()
      .click();

    cy.contains('Vous devez choisir au moins un lot').should('exist');

    cy.get('input[type=checkbox]')
      .eq(1)
      .click();

    cy.get('.promotion-options-table table tbody tr').should('have.length', 2);

    cy.contains('Réserver')
      .first()
      .click();
    cy.contains('Confirmer').click();
    cy.contains('Réservation en cours').should('exist');
  });
});
