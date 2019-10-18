import { matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Meteor } from 'meteor/meteor';

import { fetchBlogPostMeta } from 'core/api/blog';
import BlogPostSeo from 'imports/ui/pages/BlogPostPage/BlogPostSeo';

const setBlogHeaders = (sink, url) => {
  const {
    params: { slug },
  } = matchPath(url, {
    path: '/blog/:slug',
    exact: true,
    strict: false,
  });
  if (slug) {
    return fetchBlogPostMeta(slug).then((post) => {
      if (post.error) {
        return;
      }
      const { title, excerpt, post_thumbnail: postThumbnail } = post;
      sink.appendToHead(renderToString(BlogPostSeo({ ...post, url })));
      sink.appendToHead(`<meta property="og:url" content="${Meteor.settings.public.subdomains.www}${url}" />`);
      sink.appendToHead(`<meta property="og:title" content="${title}" />`);
      sink.appendToHead('<meta property="og:type" content="website" />');
      sink.appendToHead('<meta property="fb:app_id" content="1868218996582233" />');
      sink.appendToHead(`<meta property="og:description" content="${excerpt}" />`);
      sink.appendToHead(`<meta property="og:image" content="${postThumbnail.URL}" />`);
      sink.appendToHead(`<meta property="og:image:height" content="${
        postThumbnail.height
      }" />`);
      sink.appendToHead(`<meta property="og:image:width" content="${postThumbnail.width}" />`);
    });
  }
};

export const setHeaders = async (sink) => {
  const { request } = sink;
  const { path } = request.url;

  if (path.includes('/blog/')) {
    await setBlogHeaders(sink, path);
  }
};
