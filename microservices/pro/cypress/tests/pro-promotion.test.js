import { PROMOTION_LOT_STATUS } from '../../imports/core/api/promotionLots/promotionLotConstants';
/* eslint-env mocha */
import { PROMOTION_PERMISSIONS } from '../../imports/core/api/promotions/promotionConstants';
import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  PRO_EMAIL,
  PRO_EMAIL_2,
  PRO_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

describe('Pro promotion', () => {
  before(() => {
    cy.startTest({ url: '/logout' });
    cy.meteorLogout();
    cy.contains('Accédez à votre compte');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateScenario', {
      scenario: {
        users: [
          {
            _id: 'pro1',
            _factory: ROLES.PRO,
            emails: [{ address: PRO_EMAIL, verified: true }],
            organisations: {
              _id: 'orgId1',
              name: 'E2E org',
              $metadata: { isMain: true },
            },
          },
          { _factory: ROLES.ADVISOR },
        ],
      },
    });
    cy.callMethod('setPassword', { userId: 'pro1', password: PRO_PASSWORD });
    cy.meteorLogin(PRO_EMAIL, PRO_PASSWORD);
    cy.callMethod('insertFullPromotion');
  });

  beforeEach(() => {
    cy.routeTo('/');
  });

  it(`can access the promotion users tab`, () => {
    cy.contains('Promotions').click();
    cy.contains('En cours').click();

    cy.contains('Acquéreurs').click();

    // customers are invited by nobody
    cy.callMethod('setUserPermissions', {
      permissions: {
        displayCustomerNames: {
          invitedBy: 'USER',
          forLotStatus: Object.values(PROMOTION_LOT_STATUS),
        },
      },
    });
    cy.refetch();

    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr').first().contains('XXX').should('exist');
    cy.wait(200);

    cy.get('tbody tr')
      .first()
      .should('contain', 'XXX')
      .find('.icon-link')
      .last()
      .trigger('mouseover');

    cy.get('tbody tr')
      .first()
      .should('contain', 'XXX')
      .get('.popover-content')
      .should('contain', 'XXX');
    cy.get('tbody tr').first().get('.button').should('not.exist');

    // customers are invited by user
    cy.callMethod('setInvitedBy', { email: PRO_EMAIL });
    cy.refetch();
    cy.wait(500);
    cy.get('tbody tr').first().should('not.contain', 'XXX');

    cy.get('tbody tr').first().find('.icon-link').last().trigger('mouseover');
    cy.get('tbody tr')
      .first()
      .get('.popover-content')
      .should('not.contain', 'Personne');
    cy.get('tbody tr')
      .first()
      .get('.popover-content')
      .should('not.contain', 'XXX');
    cy.get('tbody tr').first().get('.button').should('not.exist');
    cy.get('tbody tr').first().find('.icon-link').last().trigger('mouseleave');

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
    cy.wait(500);
    cy.get('tbody tr').first().should('not.contain', 'XXX');
    cy.get('tbody tr').find('.icon-link').last().trigger('mouseover');
    cy.get('tbody tr')
      .get('.popover-content')
      .should('not.contain', 'Personne');
    cy.get('tbody tr').get('.popover-content').should('not.contain', 'XXX');
    cy.get('tbody tr').get('.button').should('not.exist');

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
    cy.refetch();
    cy.wait(500);

    cy.get('.actions').first().click();

    cy.contains('Supprimer').first().click();

    cy.refetch();

    cy.get('tbody')
      .find('tr')
      .should('have.length', 2 - 1);
  });

  it('Can access the promotion lot modal and start a reservation', () => {
    cy.callMethod('setUserPermissions', {
      permissions: {
        canModifyLots: true,
        canRemoveLots: true,
        canModifyPromotion: true,
        canManageDocuments: true,
        canReserveLots: true,
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

    cy.get('span.loan-count')
      .invoke('text')
      .then(text => {
        const counts = text.split('');
        cy.wrap(Number(counts.find(i => i > 0))).as('loanCount');
        cy.wrap(counts.findIndex(i => i > 0)).as('lotIndex');
      });

    cy.get('@lotIndex').then(lotIndex => {
      cy.get('.promotion-lots-table tbody tr').eq(lotIndex).click();
    });

    cy.get('@loanCount').then(count => {
      cy.contains('Acquéreurs intéressés')
        .parents('section')
        .find('tbody tr')
        .should('have.length', count);
    });

    cy.contains('Réserver').click();
    cy.contains('Confirmer').click();

    cy.contains('Acquéreurs intéressés')
      .parents('section')
      .find('table')
      .contains('Réservation en cours')
      .should('exist');

    cy.contains('Acquéreurs intéressés')
      .parents('section')
      .find('table')
      .contains('button', 'Détail')
      .click();

    cy.contains('Uploader convention').click();
    cy.get('.uploader').uploadFile('test.pdf');
    cy.get('[role=dialog] .temp-file').should('not.exist');
    cy.contains('Ok').click();

    cy.contains('Convention de réservation')
      .parents('div')
      .contains('Reçu')
      .should('exist');

    cy.contains('dans 1 mois').should('exist');

    cy.get('body').type('{esc}');
    cy.get('body').type('{esc}');

    cy.contains('Réservations')
      .closest('.card1')
      .find('table tbody tr')
      .should('have.length', 1);
  });

  it('should render buttons based on permissions', () => {
    cy.contains('Promotions').click();
    cy.contains('En cours').click();

    // canModifyPromotion
    cy.callMethod('setUserPermissions', {
      permissions: {
        canModifyPromotion: true,
        displayCustomerNames: {
          invitedBy:
            PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ANY,
        },
      },
    });
    cy.refetch();
    cy.contains('Administration').click();

    cy.contains('Modifier la promotion').should('exist');
    cy.contains('Acquéreurs').should('exist');

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

    cy.contains('Ajouter un acquéreur').should('exist');
  });

  it('should add lots and promotionLots', () => {
    cy.callMethod('setUserPermissions', {
      permissions: { canModifyPromotion: true, canAddLots: true },
    });
    cy.contains('Promotions').click();
    cy.contains('En cours').click();

    cy.contains('Administration').click();
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

    cy.contains('Administration').click();
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
    cy.contains('En cours').click();
    cy.contains('Afficher lots annexes').click();

    // Make sure links don't exist initially
    cy.get('.additional-lots-table')
      .contains('Promotion lot 1')
      .should('not.exist');
    cy.get('.promotion-lots-table').contains('Lot 2').should('not.exist');

    cy.get('.additional-lots-table tbody tr').first().click();
    // cy.wait(2000); // Try to wait for focus to settle

    cy.get('input[name=name]').clear();
    cy.get('input[name=name]').type('Lot 2');
    cy.setSelect('type', 'BASEMENT');
    cy.get('input[name=value]').clear();
    cy.get('input[name=value]').type('{backspace}2500'); // Remove initial 0
    cy.setSelect('promotionLotId', 1);
    cy.contains('Ok').click();

    cy.contains('Lot 2').should('exist');
    cy.contains('2 500').should('exist');
    cy.get('.promotion-lots-table').contains('Lot 2').should('exist');
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
    cy.contains('En cours').click();
    cy.contains('Afficher lots annexes').click();

    cy.get('.additional-lots-table tbody tr').then(trs => {
      const initialCount = trs.length;

      trs[0].click();

      cy.contains('Supprimer').click();
      cy.contains('Confirmer').click();

      cy.get('.additional-lots-table tbody')
        .find('tr')
        .should('have.length', initialCount - 1);
    });
  });
});
