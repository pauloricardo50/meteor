/* eslint-env mocha */
import { PROMOTION_LOT_STATUS } from '../../imports/core/api/promotionLots/promotionLotConstants';
import {
  PRO_EMAIL,
  PRO_EMAIL_2,
  PRO_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Pro promotion', () => {
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

  context('with a fresh promotion', () => {
    beforeEach(() => {
      cy.callMethod('resetDatabase');
      cy.callMethod('generateProFixtures');

      cy.visit('/login');
      cy.meteorLogin(PRO_EMAIL, PRO_PASSWORD);
      cy.visit('/');
    });

    it('can access the promotion users tab', () => {
      cy.callMethod('removeAllPromotions');
      cy.callMethod('insertFullPromotion');
      cy.callMethod('addProUsersToPromotion');
      cy.contains('Promotions').click();
      cy.contains('En cours').click();

      cy.contains('Clients').click();

      // customers are invited by nobody
      cy.callMethod('setUserPermissions', {
        permissions: {
          displayCustomerNames: {
            invitedBy: 'USER',
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          },
        },
      });

      cy.get('tbody tr').should('have.length', 10);

      cy.get('tbody tr')
        .first()
        .then((tr) => {
          cy.wrap(tr).should('contain', 'XXX');
          cy.wrap(tr)
            .find('.icon-link')
            .last()
            .trigger('mouseover');
          cy.get('.popover-content').should('contain', 'Personne');
          cy.get('.popover-content').should('contain', 'XXX');
          cy.wrap(tr)
            .get('.button')
            .should('not.exist');
        });

      // customers are invited by user
      cy.callMethod('setInvitedBy', { email: PRO_EMAIL });
      cy.refetch();
      cy.get('tbody tr')
        .first()
        .then((tr) => {
          cy.wrap(tr).should('not.contain', 'XXX');
          cy.wrap(tr)
            .find('.icon-link')
            .last()
            .trigger('mouseover');
          cy.get('.popover-content').should('not.contain', 'Personne');
          cy.get('.popover-content').should('not.contain', 'XXX');
          cy.wrap(tr)
            .get('.button')
            .should('not.exist');
        });

      // customers are invited by user's organisation member
      cy.callMethod('setUserPermissions', {
        permissions: {
          displayCustomerNames: {
            invitedBy: 'ORGANISATION',
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          },
        },
      });
      cy.callMethod('setInvitedBy', { email: PRO_EMAIL_2 });
      cy.refetch();
      cy.get('tbody tr')
        .first()
        .then((tr) => {
          cy.wrap(tr).should('not.contain', 'XXX');
          cy.wrap(tr)
            .find('.icon-link')
            .last()
            .trigger('mouseover');
          cy.get('.popover-content').should('not.contain', 'Personne');
          cy.get('.popover-content').should('not.contain', 'XXX');
          cy.wrap(tr)
            .get('.button')
            .should('not.exist');
        });

      // Can now delete customers
      cy.callMethod('setUserPermissions', {
        permissions: {
          displayCustomerNames: {
            invitedBy: 'ORGANISATION',
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
          },
          canInviteCustomers: true,
        },
      });

      cy.get('.actions')
        .first()
        .click();

      cy.contains('Supprimer')
        .first()
        .click();

      cy.refetch();

      cy.get('tbody')
        .find('tr')
        .should('have.length', 10 - 1);
    });

    it('Can access the promotion lot modal', () => {
      cy.callMethod('removeAllPromotions');
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
            forLotStatus: Object.values(PROMOTION_LOT_STATUS),
            invitedBy: 'ANY',
          },
        },
      });
      cy.callMethod('setInvitedBy', { email: PRO_EMAIL });
      cy.contains('Promotions').click();
      cy.contains('En cours').click();

      cy.get('td.col-loans')
        .invoke('text')
        .then((text) => {
          const counts = text.split('');
          cy.wrap(Number(counts.find(i => i > 0))).as('loanCount');
          cy.wrap(counts.findIndex(i => i > 0)).as('lotIndex');
        });

      cy.get('@lotIndex').then((lotIndex) => {
        cy.get('.promotion-lots-table tbody tr')
          .eq(lotIndex)
          .click();
      });

      cy.get('@loanCount').then((count) => {
        cy.get('.promotion-lot-loans-table tbody tr').should(
          'have.length',
          count,
        );
      });

      // Some buttons are sometimes off-screen to the right, force click on them
      cy.contains('Réserver').click({ force: true });
      cy.contains('Confirmer').click();
      cy.contains('Confirmer vente').should('exist');
      cy.contains('Annuler réservation').should('exist');
      cy.contains('Annuler réservation').click({ force: true });
      cy.contains('sûr')
        .parentsUntil('[role="document"]')
        .contains('Confirmer')
        .click();
      cy.contains('Réserver').should('exist');

      cy.get('.promotion-lots-manager')
        .children()
        .then((children) => {
          cy.wrap(children.length).as('additionalLotsCount');
        });

      cy.get('.promotion-lots-manager')
        .children()
        .first()
        .find('svg')
        .click();

      cy.refetch();

      cy.get('@lotIndex').then((lotIndex) => {
        cy.get('td.col-loans').each((td, index) => {
          const loans = td.text();

          if (loans > 0 && td && index === lotIndex) {
            td.click();
          }
        });
      });

      cy.get('@additionalLotsCount').then((count) => {
        cy.get('.promotion-lots-manager')
          .children()
          .should('have.length', count - 1);
      });

      cy.get('.promotion-lots-manager')
        .children()
        .last()
        .click();

      cy.get('[role="menuitem"').click();

      cy.refetch();

      cy.get('@lotIndex').then((lotIndex) => {
        cy.get('td.col-loans').each((td, index) => {
          const loans = td.text();

          if (loans > 0 && td && index === lotIndex) {
            td.click();
          }
        });
      });

      cy.get('@additionalLotsCount').then((count) => {
        cy.get('.promotion-lots-manager')
          .children()
          .should('have.length', count);
      });
    });
  });

  context('when logged in', () => {
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

    context('with an existing promotion', () => {
      it('should add a promotion', () => {
        cy.contains('Promotions').click();

        cy.get('.pro-dashboard-page').contains('Rien à afficher');

        cy.contains('Ajouter promotion immobilière').click();

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
      });

      it('should render buttons based on permissions', () => {
        cy.callMethod('insertPromotion');
        cy.callMethod('resetUserPermissions');
        cy.contains('Promotions').click();
        cy.contains('Test promotion').click();

        // No permissions at all
        cy.get('.promotion-page-header-actions').should('not.exist');

        // canModifyPromotion
        cy.callMethod('setUserPermissions', {
          permissions: { canModifyPromotion: true },
        });
        cy.refetch();
        cy.get('.promotion-page-header-actions > button').click();

        cy.contains('Modifier la promotion').should('exist');
        cy.contains('Clients').should('exist');

        // canAddLots
        cy.callMethod('setUserPermissions', {
          permissions: { canModifyPromotion: true, canAddLots: true },
        });
        cy.refetch();

        cy.contains('Ajouter un lot').should('exist');

        cy.contains('Ajouter un lot annexe').should('exist');

        // canManageDocuments
        cy.callMethod('setUserPermissions', {
          permissions: { canModifyPromotion: true, canManageDocuments: true },
        });
        cy.refetch();

        cy.contains('Gérer les documents').should('exist');

        // canInviteCustomers
        cy.callMethod('setUserPermissions', {
          permissions: { canInviteCustomers: true },
        });
        cy.callMethod('setPromotionStatus', { status: 'OPEN' });
        cy.refetch();

        cy.contains('Ajouter un client').should('exist');
      });

      it('should add lots and promotionLots', () => {
        cy.callMethod('setUserPermissions', {
          permissions: { canModifyPromotion: true, canAddLots: true },
        });
        cy.contains('Promotions').click();
        cy.contains('Test promotion').click();

        cy.get('.promotion-page-header-actions > button').click();
        cy.contains('Ajouter un lot').click();

        // Form should have autofocus
        // FIXME: in modal manager, it doesn't have autoFocus
        cy.get('input[name=name]').type('Promotion lot 1');
        cy.get('input[name=value]')
          .type('{backspace}') // Remove initial 0
          .type(1000000);
        cy.setSelect('propertyType', 'HOUSE');
        cy.get('input[name=insideArea]').type('120');
        cy.contains('Ok').click();

        cy.contains('Promotion lot 1').should('exist');
        cy.contains('1 000 000').should('exist');

        cy.get('.promotion-page-header-actions > button').click();
        cy.contains('Ajouter un lot annexe').click();

        cy.get('input[name=name]').type('Lot 1');
        cy.setSelect('type', 'PARKING_CAR');
        cy.get('input[name=value]')
          .type('{backspace}') // Remove initial 0
          .type(1200);
        cy.contains('Ok').click();

        cy.contains('Afficher lots annexes').click();

        cy.contains('Lot 1').should('exist');
        cy.contains('1 200').should('exist');
        cy.contains('Non alloué').should('exist');
      });

      it('should modify lots', () => {
        cy.callMethod('setUserPermissions', {
          permissions: {
            canModifyPromotion: true,
            canAddLots: true,
            canModifyLots: true,
          },
        });
        cy.contains('Promotions').click();
        cy.contains('Test promotion').click();
        cy.contains('Afficher lots annexes').click();

        // Make sure links don't exist initially
        cy.get('.additional-lots-table')
          .contains('Promotion lot 1')
          .should('not.exist');
        cy.get('.promotion-lots-table')
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
        cy.get('.promotion-lots-table')
          .contains('Lot 2')
          .should('exist');
      });

      it('should remove lots', () => {
        cy.callMethod('setUserPermissions', {
          permissions: {
            canModifyPromotion: true,
            canAddLots: true,
            canModifyLots: true,
            canRemoveLots: true,
          },
        });
        cy.contains('Promotions').click();
        cy.contains('Test promotion').click();
        cy.contains('Afficher lots annexes').click();

        cy.get('.additional-lots-table')
          .contains('Lot 2')
          .click();

        cy.contains('Supprimer').click();
        cy.contains('Lot 2').should('not.exist');
      });
    });
  });
});
