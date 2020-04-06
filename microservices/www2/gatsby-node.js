import createContentfulPages from './src/utils/createContentfulPages';
import createBlogPages from './src/utils/createBlogPages';
import setupRedirects from './src/utils/setupRedirects';

const path = require('path');

const createPages = async gatsbyNodeHelpers => {
  setupRedirects(gatsbyNodeHelpers);
  createContentfulPages(gatsbyNodeHelpers);
  createBlogPages(gatsbyNodeHelpers);
};

const onCreateWebpackConfig = ({ actions: { setWebpackConfig } }) => {
  // This should stay in this file for the alias to work
  setWebpackConfig({
    resolve: {
      symlinks: false,
      alias: {
        core: path.resolve(__dirname, 'src/core/'),
      },
    },
  });
};

export { createPages, onCreateWebpackConfig };
