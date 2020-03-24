import getPageContext from './getPageContext';

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
          contentful_id
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

  blogPosts.forEach(blogPost => {
    createPage({
      component: path.resolve('src/components/BlogPostPage/BlogPostPage.jsx'),
      ...getPageContext({ page: blogPost, pages: blogPosts, prefix: 'blog' }),
    });
  });
};

export default createBlogPages;
