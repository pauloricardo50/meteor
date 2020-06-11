import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

const constructionTimeline = [
  {
    startDate: '2020-03-01',
    percent: 30,
  },
  {
    startDate: '2020-05-01',
    percent: 30,
  },
  {
    startDate: '2020-09-01',
    percent: 20,
  },
];

describe('Admin promotion', () => {
  before(() => {
    cy.initiateTest();

    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData', {
      generateAdmins: true,
    });
    cy.callMethod('insertFullPromotion');
  });

  beforeEach(() => {
    cy.routeTo('/login');
    cy.get('.login-page');
    cy.meteorLogin(ADMIN_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
  });

  describe('promotionReservations', () => {
    it('can visit all working tabs', () => {
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();

      cy.get('.promotion-management').should('exist');

      cy.contains("Vue d'ensemble").click();
      cy.get('.promotion-lots-table table tbody tr').should('have.length', 5);

      cy.contains('Description').click();
      cy.get('.google-map').should('exist');

      cy.contains('Partenaires').click();
      cy.get('.promotion-partners')
        .contains('Architecte')
        .should('exist');

      cy.contains('Acquéreurs').click();
      cy.get('table tbody tr').should('have.length', 4);

      cy.contains('Pros').click();
      cy.get('table tbody tr').should('have.length', 5);
    });

    it('can change roles, remove a promotion Pro, and add one', () => {
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();
      cy.contains('Pros').click();

      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .find(`input[name=roles]`)
        .parent()
        .click();

      cy.get('#menu-roles')
        .contains('Visiteur')
        .click();
      cy.get('#menu-roles')
        .contains('Promoteur')
        .click();

      cy.get('body').type('{esc}');

      cy.get('table tbody tr').should('have.length', 5);

      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .find('[aria-label="Enlever de la promotion"]')
        .click();

      cy.get('table tbody tr').should('have.length', 4);

      cy.contains('Ajouter un pro').click();
      cy.get('[role=dialog]')
        .find('input[name="collection-search"]')
        .last()
        .type('visi');

      cy.get('[role=tooltip]')
        .contains('Ajouter')
        .click();

      cy.get('table tbody tr').should('have.length', 5);
    });

    it('can add and remove a customer', () => {
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();

      cy.contains('Ajouter un acquéreur').click();

      cy.get('[role=dialog]')
        .find('input[name=email]')
        .type('customer@e-potek.ch');
      cy.get('[role=dialog]')
        .find('input[name=firstName]')
        .type('Customer');
      cy.get('[role=dialog]')
        .find('input[name=lastName]')
        .type('Test');
      cy.get('[role=dialog]')
        .find('input[name=phoneNumber]')
        .type('0790000000');
      cy.setSelect('invitedBy', 1);
      cy.setSelect('promotionLotIds', 1);
      cy.get('[role=dialog] form').submit();

      cy.get('.core-tabs-tab')
        .contains('Acquéreurs')
        .click();
      cy.get('table tbody tr').should('have.length', 5);

      cy.get('.actions')
        .first()
        .click();
      cy.contains('Supprimer').click();

      cy.get('table tbody tr').should('have.length', 4);
    });

    it('can update a promotion reservation', () => {
      cy.callMethod('startPromotionReservation');
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();
      cy.contains("Vue d'ensemble").click();

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
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();
      cy.contains("Vue d'ensemble").click();

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
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();
      cy.contains("Vue d'ensemble").click();

      cy.get('.promotion-lots-table')
        .contains('2.01')
        .click();

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
