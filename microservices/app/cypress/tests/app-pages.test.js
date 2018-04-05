import { expect } from 'chai';

let testData;
const pages = {
  Login: '/login',
  App: '/',
  Loan: ({ loans }) => `/loans/${loans[0]._id}`,
  'Loan Contract': ({ loans }) => `/loans/${loans[0]._id}/contract`,
  'Loan File': ({ loans }) => `/loans/${loans[0]._id}/files`,
  'Loan Property': ({ loans }) => `/loans/${loans[0]._id}/property`,
  'Loan Finance': ({ loans }) => `/loans/${loans[0]._id}/finance`,
  'Loan Verification': ({ loans }) => `/loans/${loans[0]._id}/verification`,
  'Loan Structure': ({ loans }) => `/loans/${loans[0]._id}/structure`,
  'Loan Auction': ({ loans }) => `/loans/${loans[0]._id}/auction`,
  'Loan Strategy': ({ loans }) => `/loans/${loans[0]._id}/strategy`,
  'Loan Offerpicker': ({ loans }) => `/loans/${loans[0]._id}/offerpicker`,
  'Loan Closing': ({ loans }) => `/loans/${loans[0]._id}/closing`,
  'Add Loan': ({ loans }) => `/add-loan/${loans[0]._id}`,
  Dev: '/dev',
  Profile: '/profile',
};
const publicPages = ['Login'];

describe('App Pages', () => {
  before(() => {
    cy
      .eraseTestData()
      .generateTestData()
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
          .shouldRenderWithoutErrors();
      });
    });
  });
});
