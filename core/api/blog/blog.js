const WORDPRESS_URL = 'https://public-api.wordpress.com/rest/v1.1/sites/blogepotek.wordpress.com';

export const fetchBlogPosts = () =>
  fetch(`${WORDPRESS_URL}/posts`).then(result => result.json());

export const fetchBlogPost = blogPostId =>
  fetch(`${WORDPRESS_URL}/posts/${blogPostId}`).then(result => result.json());
