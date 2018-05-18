import { route } from '../../imports/core/cypress/testHelpers';

const pages = {
  Home: route('/', { shouldRender: '.home-page' }),

  Widget1: route('/start/1', { shouldRender: '.widget1-page' }),

  About: route('/about', { shouldRender: '.about-page' }),

  Faq: route('/faq', { shouldRender: '.faq-page' }),

  Contact: route('/contact', { shouldRender: '.contact-page' }),

  Careers: route('/careers', { shouldRender: '.careers-page' }),

  Conditions: route('/conditions', { shouldRender: '.conditions-page' }),

  Start2: route('/start/2', { shouldRender: 'section.start2' }),

  'Check Mailbox': route('/checkYourMailbox/test@e-potek.ch', {
    shouldRender: '.check-mailbox-page',
  }),

  Interests: route('/interests', { shouldRender: '.interests-page' }),

  'Not Found': route('/an-inexistent-page', {
    shouldRender: '#not-found-page',
  }),
};

describe('Www Pages', () => {
  Object.keys(pages).forEach((pageName) => {
    describe(`${pageName} Page`, () => {
      it('should render', () => {
        const {
          uri,
          options: { shouldRender },
        } = pages[pageName];

        cy.routeShouldRenderSuccessfully(pages[pageName], null, {
          reloadWindowOnNavigation: true,
        });
      });
    });
  });
});
