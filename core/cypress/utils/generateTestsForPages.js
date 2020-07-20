/* eslint-env mocha */
import capitalize from 'lodash/capitalize';

import { getTestUserByRole } from './e2eHelpers';

const generateTestsForPages = (pages, testData) => {
  before(() => {
    cy.routeTo('/');
  });

  Object.keys(pages)
    // .filter(page => page === 'admin')
    .forEach(pageAuthentication => {
      describe(capitalize(pageAuthentication), () => {
        before(() => {
          cy.routeTo('/');

          if (pageAuthentication !== 'public') {
            cy.routeTo('/login');
            cy.meteorLogin(getTestUserByRole(pageAuthentication));
          }
        });

        it('Pages should render without errors', () => {
          Object.keys(pages[pageAuthentication])
            // .filter(page => page === 'Dashboard')
            .forEach(pageName => {
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
