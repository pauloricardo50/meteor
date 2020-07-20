import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  ADMIN_EMAIL,
  DEV_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';
/* eslint-env mocha */
import { generateTestsForPages, route } from '../../imports/core/cypress/utils';
// "public", "admin", "dev" and other keys of the pages object
// are the type of authentication needed for those pages

// Make sure the selector goes deep enough (below data containers)
// so that there's no async UI loaded below it, otherwise, if an error
// occurs in the async UI, the test still passes since it already asserted
// succesfully on the outer UI.
const pages = {
  public: {
    Login: route('/login', { shouldRender: '.login-page' }),
  },

  admin: {
    Dashboard: route('/', {
      shouldRender: '.admin-dashboard-page table',
    }),

    Board: route('/board', { shouldRender: '.board-column' }),

    Profile: route('/account', { shouldRender: '.admin-account-page' }),

    Users: route('/users', { shouldRender: '.users-page table' }),

    User: route(`/users/userId`, { shouldRender: '.single-user-page' }),

    Loans: route('/loans', { shouldRender: '.loans-page table' }),

    Loan: route(`/loans/loanId`, { shouldRender: '.overview-tab' }),

    'Loan Overview Tab': route(`/loans/loanId/overview`, {
      shouldRender: '.overview-tab',
    }),

    'Loan Structures Tab': route(`/loans/loanId/structures`, {
      shouldRender: '.financing-select-residence-type',
    }),

    'Loan Borrowers Tab': route(`/loans/loanId/borrowers`, {
      shouldRender: '.borrower-forms',
    }),

    'Loan Properties Tab': route(`/loans/loanId/properties`, {
      shouldRender: '.single-property-page .google-map',
    }),

    'Loan Lenders Tab': route(`/loans/loanId/lenders`, {
      shouldRender: '.lenders-tab',
    }),

    'Loan Documents Tab': route(`/loans/loanId/files`, {
      shouldRender: '.files-tab, .new-document-form',
    }),

    'Loan Revenues Tab': route(`/loans/loanId/revenues`, {
      shouldRender: '.revenues-table',
    }),

    'Loan Actions Tab': route(`/loans/loanId/actions`, {
      shouldRender: '.actions-tab',
    }),

    Organisations: route('/organisations', {
      shouldRender: '.organisations-page',
    }),

    'Organisations Overview Tab': route('/organisations', {
      shouldRender: '.organisations-page',
    }),

    Other: route('/other', { shouldRender: '.other-page' }),

    'Other Interest Rates Tab': route('/other/interestRates', {
      shouldRender: '.interest-rates-page',
    }),

    'Other Borrowers Tab': route('/other/borrowers', {
      shouldRender: '.borrowers-page',
    }),

    Borrower: route(`/borrowers/borrowerId`, {
      shouldRender: '.single-borrower-page',
    }),

    'Other Properties Tab': route('/other/properties', {
      shouldRender: '.properties-page',
    }),

    Property: route(`/properties/propertyId`, {
      shouldRender: '.single-property-page .google-map',
    }),

    'Other Contacts Tab': route('/other/contacts', {
      shouldRender: '.contacts-page',
    }),

    'Not Found': route('/a-page-that-does-not-exist', {
      shouldRender: '#not-found-page',
    }),
  },

  dev: {
    Dev: route('/dev', { shouldRender: '#dev-page' }),
  },
};

describe.only('Admin Pages', () => {
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
          },
          {
            _id: 'dev1',
            _factory: ROLES.DEV,
            emails: [{ address: DEV_EMAIL, verified: true }],
          },
        ],
        loans: {
          _id: 'loanId',
          user: { _id: 'userId' },
          borrowers: { _id: 'borrowerId' },
          properties: {
            _id: 'propertyId',
            address1: 'Place de neuve 2',
            city: 'Genève',
            zipCode: 1201,
          },
        },
      },
    });
    cy.callMethod('setPassword', {
      userId: 'advisor1',
      password: USER_PASSWORD,
    });
    cy.callMethod('setPassword', {
      userId: 'dev1',
      password: USER_PASSWORD,
    });
  });

  generateTestsForPages(pages);
});
