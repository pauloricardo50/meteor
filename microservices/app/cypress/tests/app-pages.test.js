/* eslint-env mocha */
import {
  E2E_USER_EMAIL,
  route,
  generateTestsForPages,
} from '../../imports/core/cypress/utils';

const pages = {
  public: {
    Login: route('/login', { shouldRender: 'section.login-page' }),

    'Reset Password': route('/reset-password/fakeToken', {
      shouldRender: '#password-reset-page',
    }),

    'Enroll Account': route('/enroll-account/fakeToken', {
      shouldRender: '#password-reset-page',
    }),

    'Impersonate (Valid Token)': ({ userId, adminLoginToken }) =>
      route(`/impersonate?userId=${userId}&authToken=${adminLoginToken}`, {
        shouldRender: '#impersonation-success-message',
      }),

    'Verify Email (Invalid Token)': route('/verify-email/invalidToken', {
      shouldRender: '#email-verification-page',
    }),

    'Verify Email (Valid Token)': ({ emailVerificationToken }) =>
      route(`/verify-email/${emailVerificationToken}`, {
        shouldRender: '#email-verification-page',
      }),
  },

  user: {
    App: route('/', { shouldRender: '#app-page' }),

    Account: route('/account', { shouldRender: '#AccountPage' }),

    Dashboard: ({ preparationLoan: { _id } }) =>
      route(`/loans/${_id}`, { shouldRender: '#DashboardPage' }),

    'Loan Files': ({ preparationLoan: { _id } }) =>
      route(`/loans/${_id}/files`, { shouldRender: '#FilesPage .files-tab' }),

    'Loan Properties': ({ preparationLoan: { _id } }) =>
      route(`/loans/${_id}/properties`, {
        shouldRender: '#PropertiesPage',
      }),

    'Loan Single Property': ({ preparationLoan: { _id, properties } }) =>
      route(`/loans/${_id}/properties/${properties[0]._id}`, {
        shouldRender: '#SinglePropertyPage',
      }),

    'Borrower Personal': ({ preparationLoan: { _id } }) =>
      route(`/loans/${_id}/borrowers/personal`, {
        shouldRender: '.borrower-page-info',
      }),

    'Borrower Finance': ({ preparationLoan: { _id } }) =>
      route(`/loans/${_id}/borrowers/finance`, {
        shouldRender: '.borrower-finance-page',
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

describe('App Pages', () => {
  before(() => {
    // Visit the app so that we get the Window instance of the app
    // from which we get the `Meteor` instance used in tests
    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
    cy.callMethod('getAppEndToEndTestData', E2E_USER_EMAIL).then((data) => {
      testData = data;
    });
  });

  generateTestsForPages(pages, () => testData);
});
