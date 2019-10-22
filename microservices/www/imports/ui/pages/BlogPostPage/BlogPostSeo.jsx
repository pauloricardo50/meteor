import { Meteor } from 'meteor/meteor';

import React from 'react';

import { defaultOgTags } from 'core/components/MicroserviceHead/MicroserviceHead';

// Remove the automatic p tag that wordpress adds on the excerpt
const cleanExcerpt = (excerpt) => {
  let finalExcerpt = excerpt;
  if (finalExcerpt.indexOf('<p>') >= 0) {
    finalExcerpt = finalExcerpt.slice(finalExcerpt.indexOf('<p>') + 3);
  }

  if (finalExcerpt.indexOf('</p>') >= 0) {
    finalExcerpt = finalExcerpt.slice(0, finalExcerpt.indexOf('</p>'));
  }

  return finalExcerpt;
};

const BlogPostSeo = ({
  post: { title, excerpt, post_thumbnail: postThumbnail },
  url,
}) => (
  <>
    <meta
      property="og:url"
      content={`${Meteor.settings.public.subdomains.www}${url}`}
    />
    <meta property="og:type" content={defaultOgTags.type} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={cleanExcerpt(excerpt)} />
    <meta property="fb:app_id" content={defaultOgTags.app_id} />
    <meta property="og:image" content={postThumbnail.URL} />
    <meta property="og:image:height" content={postThumbnail.height} />
    <meta property="og:image:width" content={postThumbnail.width} />
  </>
);

export default BlogPostSeo;
