let testData;
const pages = {
  Login: '/login',
  'Reset Password': '/reset-password/fakeToken',
  'Enroll Account': '/enroll-account/fakeToken',
  'Verify Email': '/verify-email/fakeToken',
  
  App: '/',
  Profile: '/profile',

  Loan: ({ _id }) => `/loans/${_id}`,
  'Loan Files': ({ _id }) => `/loans/${_id}/files`,
  'Loan Property': ({ _id }) => `/loans/${_id}/property`,
  'Loan Verification': ({ _id }) => `/loans/${_id}/verification`,
  'Loan Structure': ({ _id }) => `/loans/${_id}/structure`,
  'Loan Auction': ({ _id }) => `/loans/${_id}/auction`,
  'Loan Strategy': ({ _id }) => `/loans/${_id}/strategy`,
  // 'Loan Offerpicker': ({ _id }) => `/loans/${_id}/offerpicker`,
  'Loan Contract': ({ _id }) => `/loans/${_id}/contract`,
  'Loan Closing': ({ _id }) => `/loans/${_id}/closing`,

  'Loan Borrower Personal': ({ _id, borrowers }) =>
    `/loans/${_id}/borrowers/${borrowers[0]._id}/personal`,
  'Loan Borrower Finance': ({ _id, borrowers }) =>
    `/loans/${_id}/borrowers/${borrowers[0]._id}/finance`,
  'Loan Borrower Files': ({ _id, borrowers }) =>
    `/loans/${_id}/borrowers/${borrowers[0]._id}/files`,

  'Not Found': '/a-page-that-does-not-exist',
};
const publicPages = ['Login'];

describe('App Pages', () => {
  before(() => {
    cy
      .eraseAndGenerateTestData()
      .meteorLogoutAndLogin()
      .getTestData()
      .then((data) => {
        testData = data;
      });
  });

  Object.keys(pages).forEach((pageName) => {
    describe(`${pageName} Page`, () => {
      it('should render', () => {
        /**
         * we login every time, as it seems that we're logged out again
         * in each test, probably because a new window instance is
         * used for every test, which results in us using new Meteor instance in every test
         */
        if (publicPages.includes(pageName)) {
          cy.meteorLogout();
        } else {
          cy.meteorLogoutAndLogin();
        }

        const pageUri =
          typeof pages[pageName] === 'function'
            ? pages[pageName](testData)
            : pages[pageName];

        cy
          .visit(pageUri)
          .waitUntilLoads()
          .shouldRenderWithoutErrors(pageUri);
      });
    });
  });
});
