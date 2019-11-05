/* eslint-env mocha */
import capitalize from 'lodash/capitalize';
import { getTestUserByRole } from './e2eHelpers';

let testData;

const generateTestsForPages = (pages, getTestData) => {
  before(() => {
    cy.visit('/');
    testData = getTestData();
  });

  Object.keys(pages)
    // .filter(page => page === 'admin')
    .forEach((pageAuthentication) => {
      describe(capitalize(pageAuthentication), () => {
        before(() => {
          cy.initiateTest();

          if (pageAuthentication !== 'public') {
            cy.visit('/login');
            cy.meteorLogin(getTestUserByRole(pageAuthentication));
          }
        });

        it('Pages should render without errors', () => {
          Object.keys(pages[pageAuthentication])
            // .filter(page => page === 'Loan Single Property')
            .forEach((pageName) => {
              const testName = `${pageName} Page`;

              cy.routeShouldRenderSuccessfully(
                pages[pageAuthentication][pageName],
                testData,
              );
            });
        });
      });
    });
};

export default generateTestsForPages;
