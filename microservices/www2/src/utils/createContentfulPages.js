import getPageContext from './getPageContext';

const path = require('path');

const getPages = async graphql => {
  const {
    data: {
      allContentfulPage: { nodes: pages },
    },
  } = await graphql(`
    query Pages {
      allContentfulPage {
        nodes {
          contentful_id
          id
          node_locale
          slug
        }
      }
    }
  `);

  return pages;
};

const createContentfulPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const pages = await getPages(graphql);

  pages.forEach(page => {
    createPage({
      component: path.resolve(
        'src/components/ContentfulPage/ContentfulPage.jsx',
      ),
      ...getPageContext({ page, pages }),
    });
  });
};

export default createContentfulPages;
