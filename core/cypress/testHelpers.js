/* eslint-env mocha */
import capitalize from 'lodash/capitalize';
import { ROLES } from '../api/users/userConstants';
import { E2E_USER_EMAIL } from '../fixtures/fixtureConstants';

export const DEV_EMAIL = 'florian@e-potek.ch';
export const ADMIN_EMAIL = 'lydia@e-potek.ch';
export { USER_PASSWORD, E2E_USER_EMAIL } from '../fixtures/fixtureConstants';

export const route = (uri, options = {}) => ({
  uri,
  options,
});

export const getTestUserByRole = role =>
  ({
    [ROLES.USER]: E2E_USER_EMAIL,
    [ROLES.ADMIN]: ADMIN_EMAIL,
    [ROLES.DEV]: DEV_EMAIL,
  }[role]);

let testData;
export const generateTestsFromPagesConfig = (pages, getTestData) => {
  before(() => {
    testData = getTestData();
  });

  Object.keys(pages)
    // .filter(page => page === 'admin')
    .forEach((pageAuthentication) => {
      describe(capitalize(pageAuthentication), () => {
        Object.keys(pages[pageAuthentication])
          // .filter(page => page === 'Property')
          .forEach((pageName) => {
            const testName = `${pageName} Page`;
            describe(testName, () => {
              it('should render', () => {
                console.log('-------------------------');
                console.log('-------------------------');
                console.log('starting test: ', testName);
                console.log('-------------------------');
                console.log('-------------------------');

                // logout the impersonated user
                const { IMPERSONATE_SESSION_KEY } = testData;
                cy.window().then(({ Session }) =>
                  Session && Session.clear(IMPERSONATE_SESSION_KEY));
                cy.printTestNameOnServer(testName);
                cy.setAuthentication(pageAuthentication);
                cy.routeShouldRenderSuccessfully(
                  pages[pageAuthentication][pageName],
                  testData,
                );
              });
            });
          });
      });
    });
};
