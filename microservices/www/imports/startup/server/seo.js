import { Meteor } from 'meteor/meteor';

import { matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import { fetchBlogPostMeta } from 'core/api/blog';
import BlogPostSeo from 'imports/ui/pages/BlogPostPage/BlogPostSeo';
import { defaultOgTags } from 'core/components/MicroserviceHead/MicroserviceHead';

const setBlogHeaders = (sink, url) => {
  const rootUrl = Meteor.settings.public.subdomains.www;

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
      sink.appendToHead(`<meta property="og:url" content="${rootUrl + url}" />`);
      sink.appendToHead(`<meta property="og:title" content="${title}" />`);
      sink.appendToHead('<meta property="og:type" content="website" />');
      sink.appendToHead('<meta property="fb:app_id" content="1868218996582233" />');
      sink.appendToHead(`<meta property="og:description" content="${excerpt}" />`);
      sink.appendToHead(`<meta property="og:image" content="${post_thumbnail.URL}" />`);
      sink.appendToHead(`<meta property="og:image:height" content="${post_thumbnail.height}" />`);
      sink.appendToHead(`<meta property="og:image:width" content="${post_thumbnail.width}" />`);
    });
  }
};

const setDefaultHeaders = (sink) => {
  const url = Meteor.settings.public.subdomains.www;
  sink.appendToHead(`<meta property="og:url" content="${url}" />`);
  sink.appendToHead(`<meta property="og:title" content="${defaultOgTags.title}" />`);
  sink.appendToHead(`<meta property="og:type" content="${defaultOgTags.type}" />`);
  sink.appendToHead(`<meta property="fb:app_id" content="${defaultOgTags.app_id}" />`);
  sink.appendToHead(`<meta property="og:description" content="${defaultOgTags.description}" />`);
  sink.appendToHead(`<meta property="og:image" content="${defaultOgTags.image}" />`);
  sink.appendToHead(`<meta property="og:image:height" content="${defaultOgTags.image_height}" />`);
  sink.appendToHead(`<meta property="og:image:width" content="${defaultOgTags.image_width}" />`);
};

export const setHeaders = async (sink) => {
  const { request } = sink;
  const { path } = request.url;

  if (path.includes('/blog/')) {
    await setBlogHeaders(sink, path);
  } else {
    await setDefaultHeaders(sink, path);
  }
};
