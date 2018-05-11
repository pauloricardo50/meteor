import { USER_EMAIL } from '../../imports/core/cypress/testHelpers';
import capitalize from 'lodash/capitalize';

const pages = {
  public: {
    Login: '/login',
    'Reset Password': '/reset-password/fakeToken',
    'Enroll Account': '/enroll-account/fakeToken',
    'Impersonate (Invalid Token)': ({ userId }) =>
      `/impersonate?userId=${userId}&authToken=invalidAdminToken`,
    'Impersonate (Valid Token)': ({ userId, adminLoginToken }) =>
      `/impersonate?userId=${userId}&authToken=${adminLoginToken}`,
  },

  user: {
    App: '/',
    Profile: '/profile',

    'Verify Email (Invalid Token)': '/verify-email/invalidToken',
    'Verify Email (Valid Token)': ({ emailVerificationToken }) =>
      `/verify-email/${emailVerificationToken}`,

    Loan: ({ step3Loan: { _id } }) => `/loans/${_id}`,
    'Add Loan': ({ unownedLoan: { _id } }) => `/add-loan/${_id}`,
    'Loan Files': ({ step3Loan: { _id } }) => `/loans/${_id}/files`,
    'Loan Property': ({ step3Loan: { _id } }) => `/loans/${_id}/property`,
    'Loan Offerpicker': ({ step3Loan: { _id } }) => `/loans/${_id}/offerpicker`,
    'Loan Verification': ({ step3Loan: { _id } }) =>
      `/loans/${_id}/verification`,
    'Loan Structure': ({ step3Loan: { _id } }) => `/loans/${_id}/structure`,
    'Loan Auction': ({ step3Loan: { _id } }) => `/loans/${_id}/auction`,
    'Loan Strategy': ({ step3Loan: { _id } }) => `/loans/${_id}/strategy`,
    'Loan Contract': ({ step3Loan: { _id } }) => `/loans/${_id}/contract`,
    'Loan Closing': ({ step3Loan: { _id } }) => `/loans/${_id}/closing`,
    'Loan Finance': ({ step3Loan: { _id } }) => `/loans/${_id}/finance`,

    'Borrower Personal': ({ step3Loan: { _id, borrowers } }) =>
      `/loans/${_id}/borrowers/${borrowers[0]._id}/personal`,
    'Borrower Finance': ({ step3Loan: { _id, borrowers } }) =>
      `/loans/${_id}/borrowers/${borrowers[0]._id}/finance`,
    'Borrower Files': ({ step3Loan: { _id, borrowers } }) =>
      `/loans/${_id}/borrowers/${borrowers[0]._id}/files`,

    'Not Found': '/a-page-that-does-not-exist',
  },

  dev: {
    Dev: '/dev',
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

  Object.keys(pages).forEach((pageAuthentication) => {
    describe(`${capitalize(pageAuthentication)} Pages`, () => {
      Object.keys(pages[pageAuthentication]).forEach((pageName) => {
        describe(`${pageName} Page`, () => {
          it('should render', () => {
            if (pageAuthentication === 'public') {
              cy.meteorLogout();
            } else {
              cy.meteorLogoutAndLogin(`${pageAuthentication}-1@e-potek.ch`);
            }

            const uri = pages[pageAuthentication][pageName];
            const pageUri = typeof uri === 'function' ? uri(testData) : uri;

            cy
              .window().then(({ reactRouterDomHistory }) => {
                reactRouterDomHistory.push(pageUri);
              })
              .wait(1000)
              .waitUntilLoads()
              .shouldRenderWithoutErrors(pageUri);
          });
        });
      });
    });
  });
});
