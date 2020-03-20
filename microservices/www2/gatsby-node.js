import createDefaultPages from './src/utils/createDefaultPages';
import createBlogPages from './src/utils/createBlogPages';
import setupRedirects from './src/utils/setupRedirects';

const createPages = async gatsbyNodeHelpers => {
  setupRedirects(gatsbyNodeHelpers);
  createDefaultPages(gatsbyNodeHelpers);
  createBlogPages(gatsbyNodeHelpers);
};

export { createPages };
