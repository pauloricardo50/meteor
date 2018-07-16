import {
  ADMIN_EMAIL,
  route,
  generateTestsFromPagesConfig,
} from '../../imports/core/cypress/testHelpers';

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
    Search: route('/search', { shouldRender: '.search-page' }),
    Profile: route('/account', { shouldRender: '.admin-account-page' }),

    Users: route('/users', { shouldRender: '.users-page .users-table' }),
    User: ({ user: { _id } }) =>
      route(`/users/${_id}`, { shouldRender: '.single-user-page' }),

    Loans: route('/loans', {
      shouldRender: '.all-loans-table',
    }),
    Loan: ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}`, {
        shouldRender: '.overview-tab',
      }),
    'Loan Overview Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/overview`, {
        shouldRender: '.overview-tab',
      }),
    'Loan Borrowers Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/borrowers`, {
        shouldRender: '.single-borrower-tab',
      }),
    'Loan Property Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/property`, {
        shouldRender: '.single-property-page .map-with-marker',
      }),
    'Loan Offers Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/offers`, {
        shouldRender: '.offers-tab',
      }),
    'Loan Communication Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/communication`, {
        shouldRender: '.communication-tab',
      }),
    'Loan Analytics Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/analytics`, {
        shouldRender: '.mixpanel-analytics',
      }),

    'Loan Forms Tab': ({ step3Loan: { _id, borrowers } }) =>
      route(`/loans/${_id}/forms`, {
        shouldRender: '.forms-tab',
        dropdownShouldRender: {
          '.forms-tab .mui-select [aria-haspopup=true]:first': [
            {
              item: `li[data-value="borrower.${borrowers[0]._id}.personal"]`,
              shouldRender: '.forms-tab .borrower-personal-autoform',
            },
            {
              item: `li[data-value="borrower.${borrowers[0]._id}.finance"]`,
              shouldRender: '.forms-tab .borrower-finance-autoform',
            },
            {
              item: `li[data-value="borrower.${borrowers[1]._id}.personal"]`,
              shouldRender: '.forms-tab .borrower-personal-autoform',
            },
            {
              item: `li[data-value="borrower.${borrowers[1]._id}.finance"]`,
              shouldRender: '.forms-tab .borrower-finance-autoform',
            },
            {
              item: `li[data-value="loan.${_id}.property"]`,
              shouldRender: `.forms-tab .loan-autoform,
                .forms-tab .property-autoform`,
            },
            {
              item: 'li[data-value="closing"]',
              shouldRender: '.forms-tab #closing-verification',
            },
            {
              item: 'li[data-value="files"]',
              shouldRender:
                '.forms-tab #file-verification-tabs [role="tablist"]',
            },
          ],
        },
      }),

    'Loan Documents Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/files`, {
        shouldRender: '.files-tab, .new-document-form',
      }),
    'Loan Actions Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/actions`, {
        shouldRender: '.actions-tab',
      }),

    Property: ({ property: { _id } }) =>
      route(`/properties/${_id}`, {
        shouldRender: '.single-property-page .map-with-marker',
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

let testData;

describe('Admin Pages', () => {
  before(() => {
    // We visit the app so that we get the Window instance of the app
    // from which we get the `Meteor` instance used in tests
    cy.visit('/');

    cy.eraseAndGenerateTestData()
      .getTestData(ADMIN_EMAIL)
      .then((data) => {
        testData = data;
      });
  });

  generateTestsFromPagesConfig(pages, () => testData);
});
