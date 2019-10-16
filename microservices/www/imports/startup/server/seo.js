import { matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

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

      const { title, excerpt, post_thumbnail } = post;
      sink.appendToHead(renderToString(BlogPostSeo({ ...post })));
      sink.appendToHead(`<meta property="og:url" content="https://www.e-potek.ch${url}" />`);
      sink.appendToHead(`<meta property="og:title" content="${title}" />`);
      sink.appendToHead('<meta property="og:type" content="website" />');
      sink.appendToHead('<meta property="fb:app_id" content="1868218996582233" />');
      sink.appendToHead(`<meta property="og:description" content="${excerpt}" />`);
      sink.appendToHead(`<meta property="og:image" content="${post_thumbnail.URL}" />`);
      sink.appendToHead(`<meta property="og:image:height" content="${
        post_thumbnail.height
        }" />`);
      sink.appendToHead(`<meta property="og:image:width" content="${post_thumbnail.width}" />`);
    });
  }
};

export const setHeaders = async (sink) => {
  const { request } = sink;
  const path = request.url.path;

  if (path.includes('/blog/')) {
    await setBlogHeaders(sink, path);
  }
};
