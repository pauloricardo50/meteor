import capitalize from 'lodash/capitalize';

let testData;

const generateTestsForPages = (pages, getTestData) => {
  before(() => {
    testData = getTestData();
  });

  Object.keys(pages)
    // .filter(page => page === 'admin')
    .forEach((pageAuthentication) => {
      describe(capitalize(pageAuthentication), () => {
        before(() => {
          cy.setAuthentication(pageAuthentication);

          // logout the impersonated user
          const { IMPERSONATE_SESSION_KEY } = testData;
          cy.window().then((context) => {
            if (context && context.Session) {
              context.Session.clear(IMPERSONATE_SESSION_KEY);
            }
          });
        });

        it('Pages should render without errors', () => {
          Object.keys(pages[pageAuthentication]).forEach((pageName) => {
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
