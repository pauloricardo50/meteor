// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Helmet } from 'react-helmet';

type MicroserviceHeadProps = {};

const formatTitle = (name = '') =>
  `e-Potek | ${name.charAt(0).toUpperCase() + name.slice(1)}`;

const MicroserviceHead = (props: MicroserviceHeadProps) => {
  const title = formatTitle(Meteor.microservice);
  const allowScale = Meteor.microservice !== 'app';
  const addFacebookData = Meteor.microservice !== 'admin';
  const rootUrl = Meteor.settings.public.subdomains[Meteor.microservice] || '';

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="manifest" href="/manifest-custom.json" />

      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content={
          allowScale
            ? 'width=device-width, initial-scale=1.0'
            : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
        }
      />

      <link
        rel="apple-touch-icon-precomposed"
        sizes="57x57"
        href="/icons/apple-touch-icon-57x57.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="114x114"
        href="/icons/apple-touch-icon-114x114.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="72x72"
        href="/icons/apple-touch-icon-72x72.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="144x144"
        href="/icons/apple-touch-icon-144x144.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="60x60"
        href="/icons/apple-touch-icon-60x60.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="120x120"
        href="/icons/apple-touch-icon-120x120.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="76x76"
        href="/icons/apple-touch-icon-76x76.png?v=3"
      />
      <link
        rel="apple-touch-icon-precomposed"
        sizes="152x152"
        href="/icons/apple-touch-icon-152x152.png?v=3"
      />
      <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-196x196.png?v=3"
        sizes="196x196"
      />
      <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-96x96.png?v=3"
        sizes="96x96"
      />
      <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-32x32.png?v=3"
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-16x16.png?v=3"
        sizes="16x16"
      />
      <link
        rel="icon"
        type="image/png"
        href="/icons/favicon-128.png?v=3"
        sizes="128x128"
      />
      <meta name="application-name" content="&nbsp;" />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta
        name="msapplication-TileImage"
        content="/icons/mstile-144x144.png?v=3"
      />
      <meta
        name="msapplication-square70x70logo"
        content="/icons/mstile-70x70.png?v=3"
      />
      <meta
        name="msapplication-square150x150logo"
        content="/icons/mstile-150x150.png?v=3"
      />
      <meta
        name="msapplication-wide310x150logo"
        content="/icons/mstile-310x150.png?v=3"
      />
      <meta
        name="msapplication-square310x310logo"
        content="/icons/mstile-310x310.png?v=3"
      />

      {addFacebookData && [
        <meta property="og:url" content={rootUrl} key="1" />,
        <meta
          property="og:image"
          content="https://d2gb1cl8lbi69k.cloudfront.net/facebook-img.png"
          key="2"
        />,
        <meta property="og:type" content="website" key="3" />,
        <meta property="og:title" content="e-Potek" key="4" />,
        <meta
          property="og:description"
          content="La révolution de l'hypothèque"
          key="5"
        />,
        <meta property="fb:app_id" content="1868218996582233" key="6" />,
      ]}
    </Helmet>
  );
};

export default MicroserviceHead;
