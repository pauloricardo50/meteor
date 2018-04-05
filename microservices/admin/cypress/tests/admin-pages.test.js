import { expect } from 'chai';

let testData;
const adminPages = {
  Login: '/login',
  'Admin Dashboard': '/',
};
const publicPages = ['Login'];

describe('Admin Pages', () => {
  before(() => {
    cy
      .eraseTestData()
      .generateTestData()
      .then((data) => {
        testData = data;
      });
  });

  Object.keys(adminPages).forEach((pageName) => {
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
          cy.meteorLogin('admin-1@epotek.ch');
        }

        const pageUri =
          typeof adminPages[pageName] === 'function'
            ? adminPages[pageName](testData)
            : adminPages[pageName];

        cy
          .visit(pageUri)
          .waitUntilLoads()
          .shouldRenderWithoutErrors();
      });
    });
  });
});
