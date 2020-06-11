import { Meteor } from 'meteor/meteor';

import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';

import { fetchBlogPostMeta } from 'core/api/blog';
import { defaultOgTags } from 'core/components/MicroserviceHead/MicroserviceHead';

import BlogPostSeo from '../../ui/pages/BlogPostPage/BlogPostSeo';

const setBlogHeaders = (sink, url) => {
  const {
    params: { slug },
  } = matchPath(url, {
    path: '/blog/:slug',
    exact: true,
    strict: false,
  });
  if (slug) {
    return fetchBlogPostMeta(slug).then(post => {
      if (post.error) {
        return;
      }

      sink.appendToHead(renderToString(BlogPostSeo({ post, url })));
    });
  }
};

const setDefaultHeaders = sink => {
  const url = Meteor.settings.public.subdomains.www;
  sink.appendToHead(`<meta property="og:url" content="${url}" />`);
  sink.appendToHead(
    `<meta property="og:title" content="${defaultOgTags.title}" />`,
  );
  sink.appendToHead(
    `<meta property="og:type" content="${defaultOgTags.type}" />`,
  );
  sink.appendToHead(
    `<meta property="fb:app_id" content="${defaultOgTags.app_id}" />`,
  );
  sink.appendToHead(
    `<meta property="og:description" content="${defaultOgTags.description}" />`,
  );
  sink.appendToHead(
    `<meta property="og:image" content="${defaultOgTags.image}" />`,
  );
  sink.appendToHead(
    `<meta property="og:image:height" content="${defaultOgTags.image_height}" />`,
  );
  sink.appendToHead(
    `<meta property="og:image:width" content="${defaultOgTags.image_width}" />`,
  );
};

export const setHeaders = async sink => {
  const { request } = sink;
  const { path } = request.url;

  if (path.startsWith('/client')) {
    // This path is used for static assets, don't do anything here
    return;
  }

  if (path.startsWith('/blog/')) {
    await setBlogHeaders(sink, path);
  } else {
    await setDefaultHeaders(sink, path);
  }
};
