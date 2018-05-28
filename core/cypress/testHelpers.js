import capitalize from 'lodash/capitalize';
import { ROLES } from '../api/users/userConstants';

export const DEV_EMAIL = 'dev-1@e-potek.ch';
export const ADMIN_EMAIL = 'admin-1@e-potek.ch';
export const USER_EMAIL = 'test-user@e-potek.ch';
export const USER_PASSWORD = '12345';

export const route = (uri, options = {}) => ({
  uri,
  options,
});

export const getTestUserByRole = (role) => {
  switch (role) {
  case ROLES.USER:
    return USER_EMAIL;
  case ROLES.ADMIN:
    return ADMIN_EMAIL;
  case ROLES.DEV:
    return DEV_EMAIL;
  default:
  }
};

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
