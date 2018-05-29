import capitalize from 'lodash/capitalize';
import { ROLES } from '../api/users/userConstants';
import { E2E_USER_EMAIL } from '../fixtures/constants';

export const DEV_EMAIL = 'dev-1@e-potek.ch';
export const ADMIN_EMAIL = 'admin-1@e-potek.ch';
export { USER_PASSWORD, E2E_USER_EMAIL } from '../fixtures/constants';

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

  Object.keys(pages).forEach((pageAuthentication) => {
    describe(capitalize(pageAuthentication), () => {
      Object.keys(pages[pageAuthentication]).forEach((pageName) => {
        describe(`${pageName} Page`, () => {
          it('should render', () => {
            // logout the impersonated user
            const { IMPERSONATE_SESSION_KEY } = testData;
            cy
              .window()
              .then(({ Session }) => Session.clear(IMPERSONATE_SESSION_KEY));

            cy
              .setAuthentication(pageAuthentication)
              .routeShouldRenderSuccessfully(
                pages[pageAuthentication][pageName],
                testData,
              );
          });
        });
      });
    });
  });
};
