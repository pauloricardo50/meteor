/* eslint-env mocha */
import {
  PRO_EMAIL,
  PRO_EMAIL_2,
  PRO_EMAIL_3,
  PRO_PASSWORD,
} from '../constants';

describe('Promotion pages', () => {
  before(() => {
    cy.initiateTest();
    cy.callMethod('resetDatabase');
    cy.callMethod('generateProFixtures');
  });

  beforeEach(() => {
    cy.visit('/login');
    cy.meteorLogin(PRO_EMAIL, PRO_PASSWORD);
    cy.visit('/');
  });

  it('can access the promotion users page', () => {
    let usersCount;

    cy.callMethod('insertFullPromotion');
    cy.wait(2000); // Wait a bit before crushing through the tests
    cy.callMethod('addProUsersToPromotion');
    cy.refetch();
    cy.contains('En cours').click();

    cy.contains('Voir tous les clients').click();

    // customers are invited by nobody
    cy.callMethod('setUserPermissions', {
      permissions: { displayCustomerNames: { invitedBy: 'USER' } },
    });

    cy.get('tbody')
      .find('tr')
      .each((tr) => {
        cy.wrap(tr)
          .contains('XXX')
          .should('exist');
        cy.wrap(tr)
          .contains('Personne')
          .should('exist');
        cy.wrap(tr)
          .get('.button')
          .should('not.exist');
      })
      .its('length')
      .should('be.gte', 6)
      .then((length) => {
        usersCount = length;
      });

    // customers are invited by user
    cy.callMethod('setInvitedBy', { email: PRO_EMAIL });
    cy.refetch();
    cy.get('tbody')
      .find('tr')
      .each((tr) => {
        cy.wrap(tr)
          .contains('XXX')
          .should('not.exist');
        cy.wrap(tr)
          .contains('Personne')
          .should('not.exist');
        cy.wrap(tr)
          .get('.button')
          .should('not.exist');
      });

    // customers are invited by user's organisation member
    cy.callMethod('setUserPermissions', {
      permissions: { displayCustomerNames: { invitedBy: 'ORGANISATION' } },
    });
    cy.callMethod('setInvitedBy', { email: PRO_EMAIL_2 });
    cy.refetch();
    cy.get('tbody')
      .find('tr')
      .each((tr) => {
        cy.wrap(tr)
          .contains('XXX')
          .should('not.exist');
        cy.wrap(tr)
          .contains('Personne')
          .should('not.exist');
        cy.wrap(tr)
          .get('.button')
          .should('not.exist');
      });

    // Can now delete customers
    cy.callMethod('setUserPermissions', {
      permissions: {
        displayCustomerNames: { invitedBy: 'ORGANISATION' },
        canInviteCustomers: true,
      },
    });

    cy.contains('Supprimer')
      .first()
      .click();
    cy.contains('Confirmer').click();

    cy.reload();

    cy.get('tbody')
      .find('tr')
      .then((tr) => {
        expect(tr.length).to.equal(usersCount - 1);
      });
  });

  it('Can access the promotion lot page', () => {
    let loanCount;
    let additionalLotsCount;

    cy.callMethod('insertFullPromotion');
    cy.callMethod('setUserPermissions', {
      permissions: {
        canSellLots: true,
        canModifyLots: true,
        canRemoveLots: true,
        canModifyPromotion: true,
        canManageDocuments: true,
        canBookLots: true,
        canInviteCustomers: true,
        canAddLots: true,
        displayCustomerNames: {
          forLotStatus: ['BOOKED', 'SOLD', 'AVAILABLE'],
          invitedBy: 'ANY',
        },
      },
    });
    cy.callMethod('setInvitedBy', { email: PRO_EMAIL });
    cy.wait(2000); // Wait for users to be generated
    cy.refetch();
    cy.contains('En cours').click();

    cy.get('.pro-promotion-lots-table td[data-id="loans"]').each((td) => {
      const loans = td.text();

      if (loanCount) {
        return;
      }

      if (loans > 0 && td) {
        loanCount = Number(loans);
        td.click();
      }
    });

    cy.url().should('include', '/promotionLots/');

    cy.get('.promotion-lot-loans-table tr').then((trs) => {
      expect(trs.length).to.equal(loanCount + 1);
    });

    cy.contains('Réserver').click();
    cy.contains('Confirmer').click();
    cy.contains('Confirmer vente').should('exist');
    cy.contains('Annuler réservation').should('exist');
    cy.contains('Annuler réservation').click();
    cy.contains('sûr')
      .parentsUntil('[role="document"]')
      .contains('Confirmer')
      .click();
    cy.contains('Réserver').should('exist');

    cy.get('.promotion-lots-manager')
      .children()
      .then((children) => {
        additionalLotsCount = children.length;
      });

    cy.get('.promotion-lots-manager')
      .children()
      .first()
      .find('svg')
      .click();

    cy.reload();

    cy.get('.promotion-lots-manager')
      .children()
      .then((children) => {
        expect(children.length).to.equal(additionalLotsCount - 1);
      });

    cy.get('.promotion-lots-manager')
      .children()
      .last()
      .click();

    cy.get('[role="menuitem"').click();

    cy.reload();

    cy.get('.promotion-lots-manager')
      .children()
      .then((children) => {
        expect(children.length).to.equal(additionalLotsCount);
      });
  });
});
