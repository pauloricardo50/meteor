/* eslint-env mocha */
import { route, generateTestsForPages } from '../../imports/core/cypress/utils';

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
      shouldRender: '.admin-dashboard-page .tasks-table',
    }),

    Profile: route('/account', { shouldRender: '.admin-account-page' }),

    Users: route('/users', { shouldRender: '.users-page .users-table' }),

    User: ({ user: { _id } }) =>
      route(`/users/${_id}`, { shouldRender: '.single-user-page' }),

    Loans: route('/loans', { shouldRender: '.loans-page' }),

    Loan: ({ loan: { _id } }) =>
      route(`/loans/${_id}`, { shouldRender: '.overview-tab' }),

    'Loan Overview Tab': ({ loan: { _id } }) =>
      route(`/loans/${_id}/overview`, { shouldRender: '.overview-tab' }),

    'Loan Borrowers Tab': ({ loan: { _id } }) =>
      route(`/loans/${_id}/borrowers`, {
        shouldRender: '.single-borrower-tab',
      }),

    'Loan Properties Tab': ({ loan: { _id } }) =>
      route(`/loans/${_id}/properties`, {
        shouldRender: '.single-property-page .google-map',
      }),

    'Loan Lenders Tab': ({ loan: { _id } }) =>
      route(`/loans/${_id}/lenders`, {
        shouldRender: '.lenders-tab',
      }),

    'Loan Documents Tab': ({ loan: { _id } }) =>
      route(`/loans/${_id}/files`, {
        shouldRender: '.files-tab, .new-document-form',
      }),

    'Loan Actions Tab': ({ loan: { _id } }) =>
      route(`/loans/${_id}/actions`, {
        shouldRender: '.actions-tab',
      }),

    Property: ({ property: { _id } }) =>
      route(`/properties/${_id}`, {
        shouldRender: '.single-property-page .google-map',
      }),

    Tasks: route('/tasks', { shouldRender: '.tasks-page .tasks-table' }),

    Borrowers: route('/borrowers', {
      shouldRender: '.borrowers-page .borrowers-table',
    }),

    Borrower: ({ borrower: { _id } }) =>
      route(`/borrowers/${_id}`, {
        shouldRender: '.single-borrower-page',
      }),

    'Not Found': route('/a-page-that-does-not-exist', {
      shouldRender: '#not-found-page',
    }),
  },

  dev: {
    Dev: route('/dev', { shouldRender: '#dev-page' }),
  },
};

describe('Admin Pages', () => {
  let testData;

  before(() => {
    cy.initiateTest();
    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
    cy.callMethod('getAdminEndToEndTestData').then((data) => {
      testData = data;
    });
  });

  generateTestsForPages(pages, () => testData);
});
