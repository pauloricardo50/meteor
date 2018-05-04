import capitalize from 'lodash/capitalize';

// "public", "admin", "dev" and other keys of the pages object
// are the type of authentication needed for those pages
const pages = {
  public: {
    Login: '/login',
  },

  admin: {
    App: '/',
    Search: '/search',
    Profile: '/profile',

    Users: '/users',
    User: ({ user: { _id } }) => `/users/${_id}`,

    Loans: '/loans',
    Loan: ({ step3Loan: { _id } }) => `/loans/${_id}`,
    'Loan Overview Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/overview`,
    'Loan Borrowers Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/borrowers`,
    'Loan Property Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/property`,
    'Loan Offers Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/offers`,
    'Loan Communication Tab': ({ step3Loan: { _id } }) =>
      `/loans/${_id}/communication`,
    'Loan Analytics Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/analytics`,
    'Loan Tasks Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/tasks`,
    'Loan Forms Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/forms`,
    'Loan Actions Tab': ({ step3Loan: { _id } }) => `/loans/${_id}/actions`,

    Property: ({ property: { _id } }) => `/properties/${_id}`,

    Tasks: '/tasks',

    Borrowers: '/borrowers',
    Borrower: ({ borrower: { _id } }) => `/borrowers/${_id}`,

    'Not Found': '/a-page-that-does-not-exist',
  },

  dev: {
    Dev: '/dev',
  },
};

let testData;

describe('Admin Pages', () => {
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
