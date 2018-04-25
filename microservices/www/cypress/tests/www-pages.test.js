const pages = {
  Home: '/',
  Widget1: '/start/1',
  About: '/about',
  faq: '/faq',
  Contact: '/contact',
  Conditions: '/conditions',
  'Not Found': '/an-inexistent-page',
};

describe('Www Pages', () => {
  Object.keys(pages).forEach((pageName) => {
    describe(`${pageName} Page`, () => {
      it('should render', () => {
        const pageUri = pages[pageName];

        cy
          .visit(pageUri)
          .waitUntilLoads()
          .shouldRenderWithoutErrors(pageUri);
      });
    });
  });
});
