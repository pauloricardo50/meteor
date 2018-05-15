import {
  USER_EMAIL,
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

    Profile: route('/profile', { shouldRender: '#account-page' }),
    'Verify Email (Invalid Token)': route('/verify-email/invalidToken', {
      shouldRender: '#email-verification-page',
    }),

    'Verify Email (Valid Token)': ({ emailVerificationToken }) =>
      route(`/verify-email/${emailVerificationToken}`, {
        shouldRender: '#email-verification-page',
      }),

    Loan: ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}`, { shouldRender: '#dashboard-page' }),

    'Add Loan': ({ unownedLoan: { _id } }) =>
      route(`/add-loan/${_id}`, { shouldRender: '#add-loan-page' }),

    'Loan Files': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/files`, { shouldRender: '#files-page .files-tab' }),

    'Loan Property': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/property`, { shouldRender: '#property-page' }),

    'Loan Offerpicker': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/offerpicker`, { shouldRender: '#offerpicker-page' }),

    'Loan Verification': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/verification`, {
        shouldRender: '#verification-page',
      }),

    'Loan Structure': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/structure`, { shouldRender: '#structure-page' }),

    'Loan Auction (Auction Not Started)': ({
      step3LoanWithNoAuction: { _id },
    }) =>
      route(`/loans/${_id}/auction`, {
        shouldRender: '#auction-page .auction-page-start',
      }),

    'Loan Auction (Auction Started)': ({
      step3LoanWithStartedAuction: { _id },
    }) =>
      route(`/loans/${_id}/auction`, {
        shouldRender: '#auction-page .auction-page-auction',
      }),

    'Loan Auction (Auction Ended)': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/auction`, {
        shouldRender: '#auction-page .auction-page-results',
      }),

    'Loan Strategy': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/strategy`, { shouldRender: '#strategy-page' }),

    'Loan Contract': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/contract`, {
        shouldRender: '#contract-page .uploader',
      }),

    'Loan Closing': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/closing`, { shouldRender: '#closing-page' }),

    'Loan Finance': ({ step3LoanWithEndedAuction: { _id } }) =>
      route(`/loans/${_id}/finance`, { shouldRender: '#finance-page' }),

    'Borrower Personal': ({ step3LoanWithEndedAuction: { _id, borrowers } }) =>
      route(`/loans/${_id}/borrowers/${borrowers[0]._id}/personal`, {
        shouldRender: '#borrower-page .borrower-page-info',
      }),

    'Borrower Finance': ({ step3LoanWithEndedAuction: { _id, borrowers } }) =>
      route(`/loans/${_id}/borrowers/${borrowers[0]._id}/finance`, {
        shouldRender: '#borrower-page .borrower-finance-page',
      }),

    'Borrower Files': ({ step3LoanWithEndedAuction: { _id, borrowers } }) =>
      route(`/loans/${_id}/borrowers/${borrowers[0]._id}/files`, {
        shouldRender: '#borrower-page .borrower-page-files .uploader',
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
    cy.visit('/');

    cy
      .eraseAndGenerateTestData()
      .getTestData(USER_EMAIL)
      .then((data) => {
        testData = data;
      });
  });

  generateTestsFromPagesConfig(pages, () => testData);
});
