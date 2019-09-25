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
    cy.get(`input[name="constructionTimeline.${index}.description"]`).type(description);
    cy.get(`input[name="constructionTimeline.${index}.duration"]`).type(duration);
    cy.get(`input[name="constructionTimeline.${index}.percent"]`).type(percent);
  });

  cy.get('button[type=submit]').click();
};

describe('Admin promotion', () => {
  before(() => {
    cy.initiateTest();

    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
    cy.callMethod('insertFullPromotion');
  });

  beforeEach(() => {
    cy.routeTo('/login');
    cy.get('.login-page');
    cy.meteorLogin(ADMIN_EMAIL, USER_PASSWORD);
    cy.routeTo('/');
  });

  it('adds construction timeline to promotion', () => {
    cy.visit('/promotions');
    cy.contains('Pré Polly').click();

    cy.contains('Répartition du financement').click();
    cy.contains('Nouvelle répartition').click();

    enterConstructionTimeline();

    cy.contains('Janv. 2020').should('exist');
    cy.contains('Mars 2021').should('exist');
  });

  it('displays an error when construction timeline percent is not 100', () => {
    cy.visit('/promotions');
    cy.contains('Pré Polly').click();

    cy.window().then((win) => {
      const promotionId = win.location.href.split('/').slice(-1)[0];
      updateConstructionTimeline({ promotionId });
      cy.reload();
    });

    cy.contains('Répartition du financement').click();

    cy.get('.list-del-field')
      .last()
      .click();

    cy.get('button[type=submit]').click();

    cy.contains("Les pourcentages doivent s'additionner à 100%").should('exist');
  });

  it('displays the promotion timeline on a promotion lot', () => {
    cy.visit('/promotions');
    cy.contains('Pré Polly').click();

    cy.window().then((win) => {
      const promotionId = win.location.href.split('/').slice(-1)[0];
      updateConstructionTimeline({ promotionId });
      cy.reload();
    });

    cy.contains('2.01').click();

    cy.contains('Modifier').click();
    cy.get('input[name=landValue]').type('{backspace}500000');
    cy.get('input[name=constructionValue]').type('{backspace}500000');
    cy.get('input[name=additionalMargin]').type('{backspace}500000');

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

  it('reuse construction timeline', () => {
    cy.visit('/promotions');
    cy.contains('Pré Polly').click();

    cy.window().then((win) => {
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

    cy.contains('Répartition du financement').click();
    cy.contains('Promotion template').click();

    cy.get('input[name=signingDate]').type('2020-01-01');
    cy.get('button[type=submit]').click();

    cy.contains('Janv. 2020').should('exist');
    cy.contains('Mars 2021').should('exist');
  });
});
