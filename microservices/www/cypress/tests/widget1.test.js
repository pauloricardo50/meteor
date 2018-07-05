/* eslint-env mocha */
describe('Widget1', () => {
  describe('On homepage', () => {
    before(() => {
      cy.visit('/');
    });

    it('opens with 0 CHF value', () => {
      cy.get('input#property')
        .then(($input) => {
          expect($input.val()).to.equal('0');
        })
        .should('have.value', '0');
    });

    it('opens with disabled Enter button', () => {
      cy.get('#widget1-property button[type="submit"]').should('be.disabled');
    });

    it('changes the CHF value to "1 000 000"', () => {
      cy.get('input#property')
        .type(1000000, { delay: 10 })
        .should('have.value', '1 000 000');
    });

    it('enables the Enter button when a value is typed', () => {
      cy.get('#widget1-property button[type="submit"]').should('be.not.disabled');
    });

    it('sets the slider to 1M value', () => {
      cy.get('#widget1-property [role="slider"]').should(
        'have.attr',
        'aria-valuenow',
        '1000000',
      );
    });

    it('navigates to `/start/1` when Enter button is pressed', () => {
      cy.contains('Entrer')
        .click()
        .location('pathname')
        .should('eq', '/start/1');
      // cy.location('pathname').should('eq', '/start/1');
    });
  });

  describe.only('On homepage with keyboard', () => {
    before(() => {
      cy.visit('/');
    });

    it('navigates to `/start/1` when Enter key is pressed', () => {
      cy.get('input#property')
        .type(1000000, { delay: 10 })
        .type('{enter}')
        .location('pathname')
        .should('eq', '/start/1');
    });
  });
});
