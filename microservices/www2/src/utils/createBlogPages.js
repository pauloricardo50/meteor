const path = require('path');

const getBlogPosts = async graphql => {
  const {
    data: {
      allContentfulBlogPost: { nodes: blogPosts },
    },
  } = await graphql(`
    query Pages {
      allContentfulBlogPost {
        nodes {
          id
          node_locale
          slug
        }
      }
    }
  `);

  return blogPosts;
};

const createBlogPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPosts = await getBlogPosts(graphql);

  blogPosts.forEach(({ slug, node_locale }) => {
    const [language] = node_locale.split('-');

    createPage({
      path: `/${language}/blog/${slug}`,
      component: path.resolve('src/components/BlogPostPage/BlogPostPage.jsx'),
      context: {
        slug,
      },
    });
  });
};

export default createBlogPages;
