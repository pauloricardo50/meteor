import {
  ADMIN_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';

const constructionTimeline = {
  signingDate: '2020-01-01',
  tranches: [
    {
      duration: 2,
      percent: 20,
    },
    {
      duration: 3,
      percent: 15,
    },
    {
      duration: 1,
      percent: 15,
    },
    {
      duration: 2,
      percent: 30,
    },
    {
      duration: 2,
      percent: 10,
    },
    {
      duration: 4,
      percent: 10,
    },
  ],
};

const updateConstructionTimeline = ({
  promotionId,
  timeline = constructionTimeline,
} = {}) => {
  const { signingDate = '2020-01-01', tranches = [] } = timeline;
  const object = {
    signingDate: new Date(signingDate).toISOString(),
    constructionTimeline: tranches.map((tranch = {}, index) => {
      const {
        description = `Tranche ${index + 1}`,
        duration = 2,
        percent = 20,
      } = tranch;
      return {
        description,
        duration,
        percent: percent / 100,
      };
    }),
  };

  return cy.callMethod('updateCollectionDocument', {
    docId: promotionId,
    collection: 'promotions',
    object,
  });
};

const enterConstructionTimeline = (timeline = constructionTimeline) => {
  const { signingDate = '2020-01-01', tranches = [] } = timeline;

  cy.get('input[name=signingDate]').type(signingDate);
  tranches.forEach((tranch = {}, index) => {
    const {
      description = `Tranche ${index + 1}`,
      duration = 2,
      percent = 20,
    } = tranch;
    cy.get('.list-add-field').click();
    cy.get(`input[name="constructionTimeline.${index}.description"]`)
      .clear()
      .type(`${description}`);
    cy.get(`input[name="constructionTimeline.${index}.duration"]`)
      .clear()
      .type(`${duration}`);
    cy.get(`input[name="constructionTimeline.${index}.percent"]`)
      .clear()
      .type(`${percent}`);
  });

  cy.get('button[type=submit]').click();
};

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

      cy.contains('Carte').click();
      cy.get('.google-map').should('exist');

      cy.contains('Partenaires').click();
      cy.get('.promotion-partners')
        .contains('Architecte')
        .should('exist');

      cy.contains('Acquéreurs').click();
      cy.get('.promotion-users-table table tbody tr').should('have.length', 4);

      cy.contains('Pros').click();
      cy.get('.promotion-users-table table tbody tr').should('have.length', 5);
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

      cy.get('.promotion-users-table table tbody tr').should('have.length', 5);

      cy.contains('visitor1@e-potek.ch')
        .parents('tr')
        .find('[aria-label="Enlever de la promotion"]')
        .click();

      cy.get('.promotion-users-table table tbody tr').should('have.length', 4);

      cy.contains('Ajouter un pro').click();
      cy.get('[role=dialog]')
        .find('input[name="collection-search"]')
        .last()
        .type('visi');

      cy.get('[role=tooltip]')
        .contains('Ajouter')
        .click();

      cy.get('.promotion-users-table table tbody tr').should('have.length', 5);
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

      cy.contains('Acquéreurs').click();
      cy.get('.promotion-users-table table tbody tr').should('have.length', 5);

      cy.get('.actions')
        .first()
        .click();
      cy.contains('Supprimer').click();

      cy.get('.promotion-users-table table tbody tr').should('have.length', 4);
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

      cy.contains('Attestation de financement').click();

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

      cy.contains('Attestation de financement')
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
      cy.contains('Nouvelle répartition').click();

      enterConstructionTimeline();

      cy.contains('Janv. 2020').should('exist');
      cy.contains('Mars 2021').should('exist');
    });

    it('displays an error when construction timeline percent is not 100', () => {
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();

      cy.window().then(win => {
        const promotionId = win.location.href.split('/').slice(-1)[0];
        updateConstructionTimeline({
          promotionId,
        });
        cy.reload();
        cy.contains("Vue d'ensemble").click();
        cy.contains('Répartition du financement').click();

        cy.get('.list-del-field')
          .last()
          .click();

        cy.get('button[type=submit]').click();

        cy.contains("Les pourcentages doivent s'additionner à 100%").should(
          'exist',
        );
      });
    });

    it('displays the promotion timeline on a promotion lot', () => {
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();
      cy.contains("Vue d'ensemble").click();

      cy.window().then(win => {
        const promotionId = win.location.href.split('/').slice(-1)[0];
        updateConstructionTimeline({ promotionId });
        cy.reload();
      });

      cy.get('.promotion-lots-table')
        .contains('2.01')
        .click();

      cy.contains('Modifier').click();
      cy.get('input[name=landValue]').type('{backspace}500000');
      cy.get('input[name=constructionValue]').type('{backspace}500000');
      cy.get('input[name=additionalMargin]').type('{backspace}500000');
      cy.setSelect('propertyType', 'HOUSE');

      cy.get('button[type=submit]').click();

      cy.get('[colspan="2"] > .construction-timeline-header > h4 > span')
        .contains('Notaire')
        .should('exist');
      cy.get('[colspan="2"] > .construction-timeline-header > b > span')
        .contains('1 000 000')
        .should('exist');

      cy.get('[colspan="6"] > .construction-timeline-header > h4 > span')
        .contains('Construction')
        .should('exist');
      cy.get('[colspan="6"] > .construction-timeline-header > b > span')
        .contains('500 000')
        .should('exist');

      cy.contains('Prix du terrain').should('exist');
      cy.contains('Mise en valeur').should('exist');

      cy.contains('Modifier').click();
      cy.get('input[name=landValue]').type('{selectall}1000000');
      cy.get('input[name=constructionValue]').type('{selectall}500000');
      cy.get('input[name=additionalMargin]').type('{selectall}{backspace}');

      cy.get('button[type=submit]').click();

      cy.get('[colspan="1"] > .construction-timeline-header > h4 > span')
        .contains('Notaire')
        .should('exist');
      cy.get('[colspan="1"] > .construction-timeline-header > b > span')
        .contains('1 000 000')
        .should('exist');

      cy.get('[colspan="6"] > .construction-timeline-header > h4 > span')
        .contains('Construction')
        .should('exist');
      cy.get('[colspan="6"] > .construction-timeline-header > b > span')
        .contains('500 000')
        .should('exist');

      cy.contains('Prix du terrain').should('exist');
      cy.contains('Mise en valeur').should('not.exist');
    });

    it('reuses construction timeline', () => {
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();

      cy.window().then(win => {
        const promotionId = win.location.href.split('/').slice(-1)[0];
        updateConstructionTimeline({ promotionId });
        cy.callMethod('updateCollectionDocument', {
          docId: promotionId,
          object: { name: 'Promotion template' },
          collection: 'promotions',
        });
        cy.callMethod('insertFullPromotion');
      });
      cy.visit('/promotions');
      cy.contains('Pré Polly').click();
      cy.contains("Vue d'ensemble").click();

      cy.contains('Répartition du financement').click();
      cy.contains('Promotion template').click();

      cy.get('input[name=signingDate]').type('2020-01-01');
      cy.get('button[type=submit]').click();

      cy.contains('Janv. 2020').should('exist');
      cy.contains('Mars 2021').should('exist');
    });
  });
});
