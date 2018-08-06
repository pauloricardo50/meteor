/* eslint-env mocha */
import {
  E2E_USER_EMAIL,
  route,
  generateTestsFromPagesConfig,
} from '../../imports/core/cypress/testHelpers';

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
  },

  user: {
    App: route('/', { shouldRender: '#app-page' }),

    Account: route('/account', { shouldRender: '#AccountPage' }),
    'Verify Email (Invalid Token)': route('/verify-email/invalidToken', {
      shouldRender: '#email-verification-page',
    }),

    'Verify Email (Valid Token)': ({ emailVerificationToken }) =>
      route(`/verify-email/${emailVerificationToken}`, {
        shouldRender: '#email-verification-page',
      }),

    Dashboard: ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}`, { shouldRender: '#DashboardPage' }),

    'Loan Files': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/files`, { shouldRender: '#FilesPage .files-tab' }),

    'Loan Properties': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/properties`, {
        shouldRender: '#PropertiesPage',
      }),

    'Loan Single Property': ({
      step3LoanWithEndedAuction: { _id, properties },
    }) =>
      route(`/loans/${_id}/properties/${properties[0]._id}`, {
        shouldRender: '#SinglePropertyPage',
      }),

    'Loan Closing': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/closing`, { shouldRender: '#ClosingPage' }),

    'Borrower Personal': ({ step3LoanWithEndedAuction: { _id, borrowers } }) =>
      route(`/loans/${_id}/borrowers/${borrowers[0]._id}/personal`, {
        shouldRender: '.borrower-page-info',
      }),

    'Borrower Finance': ({ step3LoanWithEndedAuction: { _id, borrowers } }) =>
      route(`/loans/${_id}/borrowers/${borrowers[0]._id}/finance`, {
        shouldRender: '.borrower-finance-page',
      }),

    'Borrower Files': ({ step3LoanWithEndedAuction: { _id, borrowers } }) =>
      route(`/loans/${_id}/borrowers/${borrowers[0]._id}/files`, {
        shouldRender: '.borrower-page-files .uploader',
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
    cy.visit('/');

    cy.eraseAndGenerateTestData()
      .getTestData(E2E_USER_EMAIL)
      .then((data) => {
        testData = data;
      });
  });

  generateTestsFromPagesConfig(pages, () => testData);
});
