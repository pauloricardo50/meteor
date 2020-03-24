import createContentfulPages from './src/utils/createContentfulPages';
import createBlogPages from './src/utils/createBlogPages';
import setupRedirects from './src/utils/setupRedirects';
import customizeWebpackConfig from './src/utils/customizeWebpackConfig';

const createPages = async gatsbyNodeHelpers => {
  setupRedirects(gatsbyNodeHelpers);
  createContentfulPages(gatsbyNodeHelpers);
  createBlogPages(gatsbyNodeHelpers);
};

const onCreateWebpackConfig = gatsbyNodeHelpers => {
  customizeWebpackConfig(gatsbyNodeHelpers);
};

export { createPages, onCreateWebpackConfig };
