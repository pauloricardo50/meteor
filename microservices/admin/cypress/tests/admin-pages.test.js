import {
  ADMIN_EMAIL,
  route,
  generateTestsFromPagesConfig,
} from '../../imports/core/cypress/testHelpers';

// "public", "admin", "dev" and other keys of the pages object
// are the type of authentication needed for those pages

// * For assertion accuracy, make sure the elements that are expected
// to be found in the page have pretty specific selectors
// e.g.: 'section.single-loan-page .single-property-page' and
//       not '.single-property-page', since '.single-property-page'
//       is part of the standalone property page also,
//       so we want to make sure we render the correct page.
//       Moreover, use `section.<class>` when testing, so that we match, for example,
//       `section.single-property-page` (the standalone page) and NOT the `.single-property-page`
//       of the single loan property tab
//
// * Also, make sure the selector goes deep enough (below data containers)
// so that there's no async UI loaded below it, otherwise, if an error
// occurs in the async UI, the test still passes since it already asserted
// succesfully on the outer UI.
const pages = {
  public: {
    Login: route('/login', { shouldRender: 'section.login-page' }),
  },

  admin: {
    Dashboard: route('/', {
      shouldRender: 'section.admin-dashboard-page .tasks-table',
    }),
    Search: route('/search', { shouldRender: 'section.search-page' }),
    Profile: route('/profile', { shouldRender: 'section.admin-profile-page' }),

    Users: route('/users', { shouldRender: 'section.users-page .users-table' }),
    User: ({ user: { _id } }) =>
      route(`/users/${_id}`, { shouldRender: 'section.single-user-page' }),

    Loans: route('/loans', {
      shouldRender: 'section.loans-page .all-loans-table',
    }),
    Loan: ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}`, {
        shouldRender: 'section.single-loan-page .overview-tab .tasks-table',
      }),
    'Loan Overview Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/overview`, {
        shouldRender: 'section.single-loan-page .overview-tab .tasks-table',
      }),
    'Loan Borrowers Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/borrowers`, {
        shouldRender: 'section.single-loan-page .single-borrower-tab',
      }),
    'Loan Property Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/property`, {
        shouldRender:
          'section.single-loan-page .single-property-page .map-with-marker',
      }),
    'Loan Offers Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/offers`, {
        shouldRender: 'section.single-loan-page .offers-tab',
      }),
    'Loan Communication Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/communication`, {
        shouldRender: 'section.single-loan-page .communication-tab',
      }),
    'Loan Analytics Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/analytics`, {
        shouldRender: 'section.single-loan-page .mixpanel-analytics',
      }),
    'Loan Tasks Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/tasks`, {
        shouldRender: 'section.single-loan-page .tasks-tab .tasks-table',
      }),

    'Loan Forms Tab': ({ step3Loan: { _id, borrowers } }) =>
      route(`/loans/${_id}/forms`, {
        shouldRender: 'section.single-loan-page .forms-tab',
        dropdownShouldRender: {
          'section.single-loan-page .forms-tab .mui-select [aria-haspopup=true]:first': [
            {
              item: `li[data-value="borrower.${borrowers[0]._id}.personal"]`,
              shouldRender:
                'section.single-loan-page .forms-tab .borrower-personal-autoform',
            },
            {
              item: `li[data-value="borrower.${borrowers[0]._id}.finance"]`,
              shouldRender:
                'section.single-loan-page .forms-tab .borrower-finance-autoform',
            },
            {
              item: `li[data-value="borrower.${borrowers[1]._id}.personal"]`,
              shouldRender:
                'section.single-loan-page .forms-tab .borrower-personal-autoform',
            },
            {
              item: `li[data-value="borrower.${borrowers[1]._id}.finance"]`,
              shouldRender:
                'section.single-loan-page .forms-tab .borrower-finance-autoform',
            },
            {
              item: `li[data-value="loan.${_id}.property"]`,
              shouldRender: `section.single-loan-page .forms-tab .loan-autoform,
                section.single-loan-page .forms-tab .property-autoform`,
            },
            {
              item: 'li[data-value="closing"]',
              shouldRender:
                'section.single-loan-page .forms-tab #closing-verification',
            },
            {
              item: 'li[data-value="files"]',
              shouldRender:
                'section.single-loan-page .forms-tab #file-verification-tabs [role="tablist"]',
            },
          ],
        },
      }),

    'Loan Documents Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/files`, {
        shouldRender:
          'section.single-loan-page .files-tab, section.single-loan-page .new-document-form',
      }),
    'Loan Actions Tab': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/actions`, {
        shouldRender: 'section.single-loan-page .actions-tab',
      }),

    Property: ({ property: { _id } }) =>
      route(`/properties/${_id}`, {
        shouldRender: 'section.single-property-page .map-with-marker',
      }),

    Tasks: route('/tasks', { shouldRender: 'section.tasks-page .tasks-table' }),

    Borrowers: route('/borrowers', {
      shouldRender: 'section.borrowers-page .borrowers-table',
    }),
    Borrower: ({ borrower: { _id } }) =>
      route(`/borrowers/${_id}`, {
        shouldRender: 'section.single-borrower-page',
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
    cy.visit('/');

    cy
      .eraseAndGenerateTestData()
      .getTestData(ADMIN_EMAIL)
      .then((data) => {
        testData = data;
      });
  });

  generateTestsFromPagesConfig(pages, () => testData);
});
