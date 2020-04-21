import { COMMISSION_RATES_TYPE } from '../../../../core/api/commissionRates/commissionRateConstants';
/* eslint-env mocha */
import { LOAN_STATUS } from '../../imports/core/api/loans/loanConstants';
import {
  PRO_EMAIL,
  PRO_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

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
    cy.contains('.pro-customers', 'Rien à afficher');

    inviteUser({
      email: 'test@e-potek.ch',
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '022 566 01 10',
    });
    cy.get('input[name=propertyIds]').should('not.exist');

    cy.get('form').submit();

    cy.contains('.pro-customers', 'Jean Dupont');
  });

  it('can add users to a property', () => {
    cy.contains('Bien immobilier').click();

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

    cy.contains('.pro-customers', 'Marie Dupont');
    cy.contains('.pro-customers', 'Rue du test 1');
  });

  it('can access the revenues page only if commissions exist on org', () => {
    cy.contains('.pro-side-nav', 'Revenus').should('not.exist');

    inviteUser({
      email: 'test3@e-potek.ch',
      firstName: 'Joe',
      lastName: 'Dupont',
      phoneNumber: '022 566 01 10',
    });
    cy.get('form').submit();
    cy.contains('.pro-side-nav', 'Organisation').click();

    cy.get('.organisation-id')
      .invoke('text')
      .then(organisationId =>
        cy.callMethod('generateScenario', {
          scenario: {
            organisations: {
              _id: organisationId,
              commissionRates: {
                rates: [{ rate: 0.5, threshold: 0 }],
                type: COMMISSION_RATES_TYPE.COMMISSIONS,
              },
            },
          },
        }),
      );

    cy.refetch();

    cy.contains('.pro-side-nav', 'Revenus').should('exist');

    cy.contains('.pro-side-nav', 'Revenus').click();

    cy.get(':nth-child(1) > .col-LEAD').should('have.text', '1');
    cy.get(':nth-child(1) > .col-ONGOING').should('have.text', '0');
    cy.get(':nth-child(2) > .col-LEAD').should('have.text', '-');
    cy.get(':nth-child(2) > .col-ONGOING').should('have.text', '-');

    cy.callMethod('updateAllLoans', {
      selectedStructure: 'a',
      structures: [{ id: 'a', propertyValue: 500000, wantedLoan: 400000 }],
      status: LOAN_STATUS.ONGOING,
    });

    cy.contains('.pro-side-nav', 'Dashboard').click();
    cy.contains('.pro-side-nav', 'Revenus').click();

    cy.get(':nth-child(1) > .col-LEAD').should('have.text', '0');
    cy.get(':nth-child(1) > .col-ONGOING').should('have.text', '1');
    cy.get(':nth-child(2) > .col-LEAD').should('have.text', '-');
    cy.get(':nth-child(2) > .col-ONGOING').should(cell => {
      expect(cell.text()).to.contains('2 500');
    });
  });
});
