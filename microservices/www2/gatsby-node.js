import createContentfulPages from './src/utils/createContentfulPages';
import createBlogPages from './src/utils/createBlogPages';
import setupRedirects from './src/utils/setupRedirects';

const createPages = async gatsbyNodeHelpers => {
  setupRedirects(gatsbyNodeHelpers);
  createContentfulPages(gatsbyNodeHelpers);
  createBlogPages(gatsbyNodeHelpers);
};

export { createPages };
