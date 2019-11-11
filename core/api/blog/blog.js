import queryString from 'query-string';

if (Meteor.isServer) {
  fetch = require('node-fetch');
}

// Doc: https://developer.wordpress.com/docs/api/

const WORDPRESS_URL =
  'https://public-api.wordpress.com/rest/v1.1/sites/blogepotek.wordpress.com';

const makeUrl = (url, fields) => {
  if (!fields) {
    return url;
  }

  return `${url}?${queryString.stringify({
    fields: fields.join(','),
  })}`;
};

const listFields = ['ID', 'title', 'excerpt', 'slug', 'post_thumbnail'];
const blogFields = [...listFields, 'date', 'content', 'author'];

export const fetchBlogPosts = () =>
  fetch(makeUrl(`${WORDPRESS_URL}/posts`, listFields)).then(result =>
    result.json(),
  );

export const fetchBlogPostBySlug = slug =>
  fetch(
    makeUrl(`${WORDPRESS_URL}/posts/slug:${slug}`, blogFields),
  ).then(result => result.json());

export const fetchBlogPostMeta = slug =>
  fetch(
    makeUrl(`${WORDPRESS_URL}/posts/slug:${slug}`, listFields),
  ).then(result => result.json());
