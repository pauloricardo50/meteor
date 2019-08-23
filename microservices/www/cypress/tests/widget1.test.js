/* eslint-env mocha */
import { expect } from 'chai';
import isArray from 'lodash/isArray';

const assertRecapValue = (label, value) => () =>
  cy
    .contains(label)
    .parent()
    .siblings('p')
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(value);
    });

const assertFinmaValue = (label, value) => () =>
  cy
    .contains(label)
    .parent()
    .parent()
    .siblings()
    .invoke('text')
    .then((text) => {
      if (isArray(value)) {
        expect(text).to.be.oneOf(value);
      } else {
        expect(text).to.eq(value);
      }
    });

describe('Widget1', () => {
  describe('On homepage', () => {
    before(() => {
      cy.initiateTest();

      cy.callMethod('resetDatabase');
      cy.callMethod('generateFixtures');
    });

    it.skip('opens with 0 CHF value', () => {
      cy.get('input#property')
        .then(($input) => {
          expect($input.val()).to.equal('0');
        })
        .should('have.value', '0');
    });

    it.skip('opens with disabled Enter button', () => {
      cy.get('#widget1-property button[type="submit"]').should('be.disabled');
    });

    it.skip('changes the CHF value to "1 000 000"', () => {
      cy.get('input#property')
        .type(1000000)
        .should('have.value', '1 000 000');
    });

    it.skip('enables the Enter button when a value is typed', () => {
      cy.get('#widget1-property button[type="submit"]').should('be.not.disabled');
    });

    it.skip('sets the slider to 1M value', () => {
      cy.get('#widget1-property [role="slider"]').should(
        'have.attr',
        'aria-valuenow',
        '1000000',
      );
    });

    it('navigates to `/start/1` when Calculator button is pressed', () => {
      cy.contains('Calculateur')
        .click()
        .location('pathname')
        .should('eq', '/start/1');
    });
  });

  describe.skip('On homepage with keyboard', () => {
    before(() => {
      cy.visit('/');
    });

    it('navigates to `/start/1` when Enter key is pressed', () => {
      cy.get('input#property')
        .type(1000000)
        .type('{enter}')
        .location('pathname')
        .should('eq', '/start/1');
    });
  });

  describe('full calculator', () => {
    before(() => {
      cy.visit('/start/1')
        .get('input#property')
        .type(1000000)
        .type('{enter}')
        .get('input#salary')
        .type(180000)
        .type('{enter}')
        .get('input#fortune')
        .type(250000)
        .type('{enter}');
    });

    it('displays the full calculator when matching recap values', () => {
      cy.then(assertRecapValue('Coût total du projet', '1 050 000')).then(assertRecapValue('Financement total', '1 050 000'));
    });

    it('resets the calculator when clicking reset', () => {
      cy.get('.widget1-inputs-reset')
        .click()
        .get('input#property')
        .should('have.value', '0')
        .get('input#salary')
        .should('have.value', '0')
        .get('input#fortune')
        .should('have.value', '0');
    });

    it('suggests values at perfect percentages', () => {
      cy.get('input#property')
        .type(500000)
        .get('input#salary')
        .should('have.value', '90 000')
        .get('input#fortune')
        .should('have.value', '125 000')
        .then(assertFinmaValue("Prêt / Prix d'achat", ['80.00%', '80,00%']))
        .then(assertFinmaValue('Charges / Revenus', ['33.33%', '33,33%']));
    });
  });

  describe('refinancing', () => {
    before(() => {
      cy.visit('/start/1')
        .get('#REFINANCING')
        .click()
        .get('input#property')
        .type(1000000)
        .type('{enter}')
        .get('input#salary')
        .type(180000)
        .type('{enter}')
        .get('input#currentLoan')
        .type(500000)
        .type('{enter}')
        .get('input#wantedLoan')
        .type(800000)
        .type('{enter}');
    });

    it('shows the proper recap fields', () => {
      cy.then(assertRecapValue('Prêt max possible', '800 000')).then(assertRecapValue('Augmentation du prêt', '300 000'));
    });
  });
});
