import React from 'react';
import { Meteor } from 'meteor/meteor';

export default ({ title, excerpt, post_thumbnail: postThumbnail, url }) => (
  <>
    <meta property="og:url" content={`${Meteor.settings.public.subdomains.www}${url}`} />
    <meta
      property="og:image"
      content="https://d2gb1cl8lbi69k.cloudfront.net/facebook-img.png"
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={excerpt} />
    <meta property="fb:app_id" content="1868218996582233" />
    <meta property="og:image" content={postThumbnail.URL} />
    <meta property="og:image:height" content={postThumbnail.height} />
    <meta property="og:image:width" content={postThumbnail.width} />
  </>
);
