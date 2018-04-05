import { expect } from 'chai';

const pages = {
  Home: '/',
};

describe('Www Pages', () => {
  it('should fail', () => {
    expect(false).to.be.true;
  });

  Object.keys(pages).forEach((pageName) => {
    describe(`${pageName} Page`, () => {
      it('should render', () => {
        const pageUri = pages[pageName];

        cy
          .visit(pageUri)
          .waitUntilLoads()
          .shouldRenderWithoutErrors();
      });
    });
  });
});
