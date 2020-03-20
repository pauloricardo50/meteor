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
          slug
          node_locale
        }
      }
    }
  `);

  return pages;
};

const createDefaultPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const pages = await getPages(graphql);

  pages.forEach(({ slug, node_locale }) => {
    const [language] = node_locale.split('-');

    createPage({
      path: `/${language}/${slug}`,
      component: path.resolve('src/components/WwwPage/index.js'),
      context: {
        slug,
      },
    });
  });
};

export default createDefaultPages;
