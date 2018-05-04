import capitalize from 'lodash/capitalize';

let testData;
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
    'Loan Verification': ({ step3Loan: { _id } }) =>
      `/loans/${_id}/verification`,
    'Loan Structure': ({ step3Loan: { _id } }) => `/loans/${_id}/structure`,
    'Loan Auction': ({ step3Loan: { _id } }) => `/loans/${_id}/auction`,
    'Loan Strategy': ({ step3Loan: { _id } }) => `/loans/${_id}/strategy`,
    'Loan Offerpicker': ({ step3Loan: { _id } }) => `/loans/${_id}/offerpicker`,
    'Loan Contract': ({ step3Loan: { _id } }) => `/loans/${_id}/contract`,
    'Loan Closing': ({ step3Loan: { _id } }) => `/loans/${_id}/closing`,

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

describe('App Pages', () => {
  before(() => {
    cy
      .eraseAndGenerateTestData()
      .getTestData()
      .then((data) => {
        testData = data;
      });
  });

  Object.keys(pages).forEach((pageAuthentication) => {
    describe(`${capitalize(pageAuthentication)} Pages`, () => {
      Object.keys(pages[pageAuthentication]).forEach((pageName) => {
        describe(`${pageName} Page`, () => {
          it('should render', () => {
            /**
             * we login every time, as it seems that we're logged out again
             * in each test, probably because a new window instance is
             * used for every test, which results in us using new Meteor instance in every test
             */
            if (pageAuthentication === 'public') {
              cy.meteorLogout();
            } else {
              cy.meteorLogoutAndLogin(`${pageAuthentication}-1@e-potek.ch`);
            }

            const uri = pages[pageAuthentication][pageName];
            const pageUri = typeof uri === 'function' ? uri(testData) : uri;

            cy
              .visit(pageUri)
              .waitUntilLoads()
              .shouldRenderWithoutErrors(pageUri);
          });
        });
      });
    });
  });
});
