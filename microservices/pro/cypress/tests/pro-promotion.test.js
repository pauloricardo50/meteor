/* eslint-env mocha */
import { PRO_EMAIL, PRO_PASSWORD } from '../constants';

describe('Pro', () => {
  before(() => {
    cy.initiateTest();
    cy.callMethod('resetDatabase');
    cy.callMethod('generateProFixtures');
  });

  it('should login', () => {
    cy.url().should('include', 'login');
    cy.get('input[name=email]').type(PRO_EMAIL);
    cy.get('input[name=password]').type(`${PRO_PASSWORD}{enter}`);
    cy.location('pathname').should('eq', '/');
  });

  context('when logged in', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.meteorLogin(PRO_EMAIL, PRO_PASSWORD);
      cy.visit('/');
    });

    it('should add a promotion', () => {
      cy.get('.pro-dashboard-page').contains('Rien à afficher');

      cy.get('.buttons > a').click();
      cy.location('pathname').should('eq', '/promotions/new');

      cy.get('input[name=name]').type('New promotion');
      cy.setSelect('type', 'CREDIT');
      cy.get('input[name=address1]').type('Chemin Auguste-Vilbert 14');
      cy.get('input[name=address2]').type('1er étage');
      cy.get('input[name=zipCode]').type('1218');
      cy.get('input[name=city]').type('Le Grand-Saconnex{enter}');

      cy.url().should('include', 'promotions/');
      cy.get('h1').should('contain', 'New promotion');
      cy.contains('Chemin Auguste-Vilbert 14, 1218 Le Grand-Saconnex').should('exist');

      cy.contains('Préparation').should('exist');
      cy.get('.buttons > span button').should('be.disabled');
    });

    context('with an existing promotion', () => {
      it('should add lots and promotionLots', () => {
        cy.callMethod('insertPromotion');
        cy.refetch();
        cy.contains('Test promotion').click();

        cy.get('.promotion-table-actions > button:first-of-type').click();
        cy.wait(2000); // Try to wait for focus to settle

        // Form should have autofocus
        cy.focused().type('Promotion lot 1');
        cy.get('input[name=value]')
          .type('{backspace}') // Remove initial 0
          .type(1000000);
        cy.setSelect('propertyType', 'HOUSE');
        cy.get('input[name=insideArea]').type('120{enter}');

        cy.contains('Promotion lot 1').should('exist');
        cy.contains('1 000 000').should('exist');

        cy.get('.promotion-table-actions > button:last-of-type').click();

        // Form should have autofocus
        cy.focused().type('Lot 1');
        cy.setSelect('type', 'PARKING_CAR');
        cy.get('input[name=value]')
          .type('{backspace}') // Remove initial 0
          .type(1200);
        cy.contains('Ok').click();

        cy.get('.additional-lots button').click();

        cy.contains('Lot 1').should('exist');
        cy.contains('1 200').should('exist');
        cy.contains('Non alloué').should('exist');
      });

      it('should modify lots', () => {
        cy.contains('Test promotion').click();
        cy.get('.additional-lots button').click();

        // Make sure links don't exist initially
        cy.get('.additional-lots-table')
          .contains('Promotion lot 1')
          .should('not.exist');
        cy.get('.pro-promotion-lots-table')
          .contains('Lot 2')
          .should('not.exist');

        cy.contains('Lot 1').click();
        cy.wait(2000); // Try to wait for focus to settle

        cy.get('input[name=name]').clear();
        cy.get('input[name=name]').type('Lot 2');
        cy.setSelect('type', 'BASEMENT');
        cy.get('input[name=value]').clear();
        cy.get('input[name=value]').type('{backspace}2500'); // Remove initial 0
        cy.setSelect('promotionLot', 1);
        cy.contains('Ok').click();

        cy.contains('Lot 2').should('exist');
        cy.contains('2 500').should('exist');
        cy.contains('1 002 500').should('exist');
        cy.get('.additional-lots-table')
          .contains('Promotion lot 1')
          .should('exist');
        cy.get('.pro-promotion-lots-table')
          .contains('Lot 2')
          .should('exist');
      });
    });
  });
});
