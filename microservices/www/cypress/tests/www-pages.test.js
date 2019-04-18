/* eslint-env mocha */
import { route } from '../../imports/core/cypress/utils';

const pages = {
  Home: route('/', { shouldRender: '.home-page' }),

  Widget1: route('/start/1', { shouldRender: '.widget1-page' }),

  About: route('/about', { shouldRender: '.about-page' }),

  Faq: route('/faq', { shouldRender: '.faq-page' }),

  Contact: route('/contact', { shouldRender: '.contact-page' }),

  Careers: route('/careers', { shouldRender: '.careers-page' }),

  Conditions: route('/conditions', { shouldRender: '.conditions-page' }),

  'Check Mailbox': route('/checkYourMailbox/test@e-potek.ch', {
    shouldRender: '.check-mailbox-page',
  }),

  Interests: route('/interests', { shouldRender: '.interests-page' }),

  Blog: route('/blog', { shouldRender: '.blog-page' }),

  BlogPost: route('/blog/notre-vision-de-le-potek', {
    shouldRender: '.blog-post-page-content',
  }),

  'Not Found BlogPost': route('/blog/unknown', {
    shouldRender: '#not-found-page',
  }),

  'Not Found': route('/an-inexistent-page', {
    shouldRender: '#not-found-page',
  }),
};

describe('Www Pages', () => {
  before(() => {
    cy.initiateTest();

    cy.callMethod('resetDatabase');
    cy.callMethod('generateFixtures');
  });

  Object.keys(pages).forEach((pageName) => {
    it(`${pageName} Page should render`, () => {
      cy.routeShouldRenderSuccessfully(pages[pageName], null, {
        reloadWindowOnNavigation: true,
      });
    });
  });
});
