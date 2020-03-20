const path = require('path');

const getPages = async graphql => {
  const {
    data: {
      allContentfulPage: { nodes: pages },
    },
  } = await graphql(
    `
      {
        allContentfulPage {
          nodes {
            slug
            node_locale
          }
        }
      }
    `,
  );

  return pages;
};

const createDefaultPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const pages = await getPages(graphql);
  console.log('pages:', pages);

  pages.forEach(({ slug, node_locale }) => {
    createPage({
      path: `/${node_locale}/${slug}`,
      component: path.resolve('src/components/WwwPage/index.js'),
      context: {
        slug,
      },
    });
  });
};

export default createDefaultPages;
