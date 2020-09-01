import { PROMOTION_OPTION_STATUS } from '../../imports/core/api/promotionOptions/promotionOptionConstants';
import {
  PROMOTION_STATUS,
  PROMOTION_USERS_ROLES,
} from '../../imports/core/api/promotions/promotionConstants';
import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

const constructionTimeline = [
  { startDate: '2020-03-01', percent: 30 },
  { startDate: '2020-05-01', percent: 30 },
  { startDate: '2020-09-01', percent: 20 },
];

describe('Admin promotion', () => {
  before(() => {
    cy.startTest({ url: '/login' });
    cy.meteorLogout();
    cy.contains('Accédez à votre compte');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateScenario', {
      scenario: {
        users: [
          {
            _id: 'advisor1',
            _factory: ROLES.ADVISOR,
            emails: [{ address: ADMIN_EMAIL, verified: true }],
            organisations: { $metadata: { isMain: true } },
          },
        ],
        organisations: { _id: 'org1', name: 'Pro org' },
        promotions: {
          _id: 'promotionId',
          name: 'Test promotion',
          status: PROMOTION_STATUS.OPEN,
          address1: 'Place de neuve 2',
          city: 'Genève',
          zipCode: 1201,
          contacts: [{ name: 'Joe', title: 'Architecte' }],
          properties: [
            { _id: 'prop1', name: 'A1', value: 1000000 },
            { _id: 'prop2', name: 'A2', value: 1000000 },
          ],
          promotionLots: [
            { _id: 'pLot1', propertyLinks: [{ _id: 'prop1' }] },
            { propertyLinks: [{ _id: 'prop2' }] },
          ],
          users: [
            {
              _id: 'pro1',
              _factory: ROLES.PRO,
              emails: [{ address: 'visitor1@e-potek.ch', verified: true }],
              firstName: '',
              lastName: '',
              $metadata: { roles: [PROMOTION_USERS_ROLES.VISITOR] },
              organisations: { _id: 'org1', $metadata: { isMain: true } },
            },
            {
              _id: 'pro2',
              _factory: ROLES.PRO,
              emails: [{ address: 'broker1@e-potek.ch', verified: true }],
              firstName: '',
              lastName: '',
              $metadata: { roles: [PROMOTION_USERS_ROLES.BROKER] },
              organisations: { _id: 'org1', $metadata: { isMain: true } },
            },
          ],
          loans: [
            {
              user: {},
              promotionOptions: {
                status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
                promotionLots: { _id: 'pLot1' },
                promotion: { _id: 'promotionId' },
              },
              $metadata: { invitedBy: 'pro2' },
            },
            { $metadata: { invitedBy: 'pro2' }, user: {} },
            { $metadata: { invitedBy: 'pro2' }, user: {} },
            { $metadata: { invitedBy: 'pro2' }, user: {} },
          ],
        },
      },
    });
    cy.callMethod('setPassword', {
      userId: 'advisor1',
      password: USER_PASSWORD,
    });
    cy.meteorLogin(ADMIN_EMAIL, USER_PASSWORD);
  });

  beforeEach(() => {
    cy.routeTo('/');
  });

  describe('promotionReservations', () => {
    it('can visit all working tabs', () => {
      cy.routeTo('/promotions/promotionId');
      cy.get('.promotion-management').should('exist');

      cy.contains("Vue d'ensemble").click();
      cy.get('.promotion-lots-table table tbody tr').should('have.length', 2);

      cy.contains('Description').click();
      cy.get('.google-map').should('exist');

      cy.contains('Partenaires').click();
      cy.get('.promotion-partners').contains('Architecte').should('exist');

      cy.contains('Acquéreurs').click();
      cy.get('table tbody tr').should('have.length', 4);

      cy.contains('Pros (').click();
      cy.get('table tbody tr').should('have.length', 2);
    });

    it('can change roles, remove a promotion Pro, and add one', () => {
      cy.routeTo('/promotions/promotionId/users');

      cy.wait(1000);

      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .find(`[aria-label="Modifier rôles"]`)
        .click();

      cy.get(`input[name=roles]`).parent().click();

      // Remove role
      cy.get('#menu-roles').contains('Visiteur').click();

      // Add role
      cy.get('#menu-roles').contains('Promoteur').click();
      cy.get('[role=dialog] form').submit();

      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .contains('Promoteur')
        .should('exist');
      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .contains('Visiteur')
        .should('not.exist');

      cy.get('table tbody tr').should('have.length', 2);

      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .find('[aria-label="Enlever de la promotion"]')
        .click();
      cy.contains('Confirmer').click();

      cy.get('table tbody tr').should('have.length', 1);

      cy.contains('button', 'Administration').click();
      cy.contains('Ajouter un Pro').click();
      cy.get('[role=dialog]')
        .find('input[name="collection-search"]')
        .last()
        .type('visi');

      cy.get('[role=tooltip]').contains('Ajouter').click();

      cy.get('table tbody tr').should('have.length', 2);
    });

    it('can add and remove a customer', () => {
      cy.routeTo('/promotions/promotionId');

      cy.contains('Ajouter un acquéreur').click();

      cy.get('[role=dialog]')
        .find('input[name=email]')
        .type('customer@e-potek.ch');
      cy.get('[role=dialog]').find('input[name=firstName]').type('Customer');
      cy.get('[role=dialog]').find('input[name=lastName]').type('Test');
      cy.get('[role=dialog]')
        .find('input[name=phoneNumber]')
        .type('0790000000');
      cy.setSelect('invitedBy', 1);
      cy.setSelect('status', 1);
      cy.setSelect('promotionLotIds', 1);

      cy.get('[role=dialog] form').submit();

      cy.get('.core-tabs-tab').contains('Acquéreurs').click();
      cy.get('table tbody tr').should('have.length', 5);

      cy.get('.actions').first().click();
      cy.contains('Supprimer').click();

      cy.get('table tbody tr').should('have.length', 4);
    });

    it('can update a promotion reservation', () => {
      cy.callMethod('startPromotionReservation');
      cy.routeTo('/promotions/promotionId/overview');

      cy.contains('Réservations')
        .closest('.card1')
        .find('table tbody tr')
        .should('have.length', 1)
        .click();

      cy.contains('Accord de principe').click();

      cy.get('input[name=status]')
        .parent()
        .click()
        .get(`[data-value=VALIDATED]`)
        .click();
      cy.get('input[name=date]').type('2020-01-01T10:10');

      cy.contains('Ok').click();
      cy.contains('Oui').click();

      cy.contains('Vérouiller les formulaires')
        .parents('[role=dialog]')
        .contains('Oui')
        .click();

      cy.contains('Accord de principe')
        .parents('div')
        .contains('Validé')
        .should('exist');
    });
  });

  describe('Construction timelines', () => {
    it('adds construction timeline to promotion', () => {
      cy.routeTo('/promotions/promotionId/overview');

      cy.contains('Répartition du financement').click();

      cy.get('input[name="constructionTimeline.startPercent"]').type(10);

      constructionTimeline.forEach((tranch = {}, index) => {
        const {
          description = `Tranche ${index + 1}`,
          startDate,
          percent = 20,
        } = tranch;
        cy.get('.list-add-field').click();
        cy.get(`input[name="constructionTimeline.steps.${index}.description"]`)
          .clear()
          .type(`${description}`);
        cy.get(`input[name="constructionTimeline.steps.${index}.startDate"]`)
          .clear()
          .type(`${startDate}`);
        cy.get(`input[name="constructionTimeline.steps.${index}.percent"]`)
          .clear()
          .type(`${percent}`);
      });

      cy.get('input[name="constructionTimeline.endDate"]').type('2020-12-01');
      cy.get('input[name="constructionTimeline.endPercent"]').type(10);

      cy.get('button[type=submit]').click();
      cy.contains('À déterminer').should('exist');
      cy.contains('+9 mois').should('exist');

      cy.contains('Répartition du financement').click();
      cy.get('input[name=signingDate]').type('2020-01-01');
      cy.get('button[type=submit]').click();

      cy.contains('1 janvier 2020').should('exist');
      cy.contains('1 mars 2020').should('exist');
      cy.contains('1 décembre 2020').should('exist');
    });

    it('displays the promotion timeline on a promotion lot', () => {
      cy.routeTo('/promotions/promotionId/overview');

      cy.get('.promotion-lots-table').contains('A1').click();

      cy.contains('Modifier').click();
      cy.get('input[name=value]').type('{selectall}{backspace}');
      cy.get('input[name=landValue]').type('{backspace}500000');
      cy.get('input[name=constructionValue]').type('{backspace}500000');
      cy.get('input[name=additionalMargin]').type('{backspace}500000');
      cy.setSelect('propertyType', 'HOUSE');

      cy.get('button[type=submit]').click();

      cy.contains('CHF 1 050 000').should('exist');

      cy.contains('Chez le notaire')
        .parents('.construction-timeline-header')
        .contains('CHF 1 050 000')
        .should('exist');
      cy.contains('Durant la construction')
        .parents('.construction-timeline-header')
        .contains('CHF 450 000')
        .should('exist');

      cy.contains('Quote-part terrain').should('exist');
      cy.contains('Versement EG à la signature').should('exist');

      cy.get('.promotion-lot-detail .construction-timeline-item').should(
        'have.length',
        6,
      );
    });
  });
});
