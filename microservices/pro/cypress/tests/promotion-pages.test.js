/* eslint-env mocha */
import { PRO_EMAIL, PRO_PASSWORD } from '../constants';

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
    cy.refetch();
    cy.contains('En cours').click();

    cy.contains('Voir tous les utilisateurs').click();

    cy.get('tbody')
      .find('tr')
      .then((tr) => {
        usersCount = tr.length;
        // Change this to be exactly 10 when roles is reliable
        //  https://github.com/alanning/meteor-roles/pull/271
        expect(tr.length).to.be.at.least(6);
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
