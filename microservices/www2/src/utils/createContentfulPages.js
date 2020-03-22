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

  pages.forEach(({ id, node_locale, slug }) => {
    const [language] = node_locale.split('-');

    createPage({
      path: `/${language}/${slug}`,
      component: path.resolve(
        'src/components/ContentfulPage/ContentfulPage.jsx',
      ),
      context: { slug, id },
    });
  });
};

export default createContentfulPages;
