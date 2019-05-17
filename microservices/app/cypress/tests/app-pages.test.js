/* eslint-env mocha */
import { route, generateTestsForPages } from '../../imports/core/cypress/utils';

const pages = {
  public: {
    Login: route('/login', { shouldRender: 'section.login-page' }),

    'Reset Password': ({ passwordResetToken }) =>
      route(`/reset-password/${passwordResetToken}`, {
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

    Dashboard: ({ requestLoan: { _id } }) =>
      route(`/loans/${_id}`, { shouldRender: '#DashboardPage' }),

    'Loan Files': ({ requestLoan: { _id } }) =>
      route(`/loans/${_id}/files`, { shouldRender: '#FilesPage .files-tab' }),

    'Loan Properties': ({ requestLoan: { _id } }) =>
      route(`/loans/${_id}/properties`, {
        shouldRender: '#PropertiesPage',
      }),

    'Loan Single Property': ({ requestLoan: { _id, properties } }) =>
      route(`/loans/${_id}/properties/${properties[0]._id}`, {
        shouldRender: '#SinglePropertyPage',
      }),

    'Borrower Personal': ({ requestLoan: { _id } }) =>
      route(`/loans/${_id}/borrowers/personal`, {
        shouldRender: '.borrower-page-info',
      }),

    'Borrower Finance': ({ requestLoan: { _id } }) =>
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

describe('App Pages', () => {
  let testData;

  before(() => {
    cy.initiateTest();
    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
    cy.callMethod('getAppEndToEndTestData').then((data) => {
      testData = data;
    });
  });

  generateTestsForPages(pages, () => testData);
});
