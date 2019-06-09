/* eslint-env mocha */
import { LOAN_STATUS } from '../../imports/core/api/loans/loanConstants';
import { PRO_EMAIL, PRO_PASSWORD } from '../proE2eConstants';

const inviteUser = ({ firstName, lastName, email, phoneNumber }) => {
  cy.contains('Inviter un client').click();

  cy.get('input[name="email"]').type(email);
  cy.get('input[name="firstName"]').type(firstName);
  cy.get('input[name="lastName"]').type(lastName);
  cy.get('input[name="phoneNumber"]').type(phoneNumber);
};

describe('Promotion pages', () => {
  before(() => {
    cy.initiateTest();
  });

  beforeEach(() => {
    cy.callMethod('resetDatabase');
    cy.callMethod('generateProFixtures');

    cy.visit('/login');
    cy.meteorLogin(PRO_EMAIL, PRO_PASSWORD);
    cy.visit('/');
  });

  it('can add users', () => {
    cy.get('.pro-customers').contains('Rien à afficher');

    inviteUser({
      email: 'test@e-potek.ch',
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '022 566 01 10',
    });
    cy.get('input[name=propertyIds]').should('not.exist');

    cy.get('form').submit();

    cy.get('.pro-customers').contains('Jean Dupont');
  });

  it('can add users to a property', () => {
    cy.contains('Ajouter bien immobilier').click();

    cy.get('input[name=address1]').type('Rue du test 1');
    cy.get('input[name=city]').type('Genève');
    cy.get('input[name=zipCode]').type('1201');
    cy.get('input[name=value]').type('1000000{enter}');
    cy.url().should('include', 'properties/');

    cy.visit('/');

    inviteUser({
      email: 'test2@e-potek.ch',
      firstName: 'Marie',
      lastName: 'Dupont',
      phoneNumber: '022 566 01 10',
    });
    cy.setSelect('propertyIds', 0);
    cy.get('body').trigger('keydown', { keyCode: 27, which: 27 }); // Hit escape to restore keyboard control
    cy.get('input[name="phoneNumber"]').type('{enter}');

    cy.get('.pro-customers').contains('Marie Dupont');
    cy.get('.pro-customers').contains('Rue du test 1');
  });

  it('can access the revenues page only if commissions exist on org', () => {
    cy.get('.pro-side-nav')
      .contains('Revenus')
      .should('not.exist');

    inviteUser({
      email: 'test3@e-potek.ch',
      firstName: 'Joe',
      lastName: 'Dupont',
      phoneNumber: '022 566 01 10',
    });
    cy.get('form').submit();

    cy.callMethod('editOrganisation', {
      commissionRates: [{ rate: 0.5, threshold: 0 }],
    });

    cy.get('.pro-side-nav')
      .contains('Revenus')
      .should('exist');

    cy.get('.pro-side-nav')
      .contains('Revenus')
      .click();

    cy.get(':nth-child(1) > .col-LEAD').should('have.text', '1');
    cy.get(':nth-child(1) > .col-ONGOING').should('have.text', '0');
    cy.get(':nth-child(2) > .col-LEAD').should('have.text', '-');
    cy.get(':nth-child(2) > .col-ONGOING').should('have.text', '-');

    cy.callMethod('updateAllLoans', {
      selectedStructure: 'a',
      structures: [{ id: 'a', propertyValue: 500000, wantedLoan: 400000 }],
      status: LOAN_STATUS.ONGOING,
    });

    cy.get('.pro-side-nav')
      .contains('Dashboard')
      .click();
    cy.get('.pro-side-nav')
      .contains('Revenus')
      .click();

    cy.get(':nth-child(1) > .col-LEAD').should('have.text', '0');
    cy.get(':nth-child(1) > .col-ONGOING').should('have.text', '1');
    cy.get(':nth-child(2) > .col-LEAD').should('have.text', '-');
    cy.get(':nth-child(2) > .col-ONGOING').should((cell) => {
      expect(cell.text()).to.contains('2 500');
    });
  });
});
