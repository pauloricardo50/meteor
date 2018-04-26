let testData;
const pages = {
  Login: '/login',
  Profile: '/profile',
  'Loan Property': ({ loans }) => `/loans/${loans[0]._id}/property`,
  'Loan Verification': ({ loans }) => `/loans/${loans[0]._id}/verification`,
  'Loan Structure': ({ loans }) => `/loans/${loans[0]._id}/structure`,
  'Loan Strategy': ({ loans }) => `/loans/${loans[0]._id}/strategy`,
  'Loan Contract': ({ loans }) => `/loans/${loans[0]._id}/contract`,
  'Loan Closing': ({ loans }) => `/loans/${loans[0]._id}/closing`,
  'Loan File': ({ loans }) => `/loans/${loans[0]._id}/files`,
  Loan: ({ loans }) => `/loans/${loans[0]._id}`,
  'Reset Password': '/reset-password/fakeToken',
  'Enroll Account': '/enroll-account/fakeToken',
  'Verify Email': '/verify-email/fakeToken',
  App: '/',
  'Not Found': '/a-page-that-does-not-exist',
};
const publicPages = ['Login'];

describe('App Pages', () => {
  before(() => {
    cy
      .eraseAndGenerateTestData()
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
          cy.meteorLogin();
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
