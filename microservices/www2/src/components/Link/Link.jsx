import React from 'react';
import { Link as GatsbyLink } from 'gatsby';

import { linkResolver } from '../../utils/linkResolver';

const Link = ({ prismicLink, to, href, ...props }) => {
  if (!prismicLink) {
    if (to) {
      return <GatsbyLink {...props} to={to} />;
    }
    if (href) {
      return <a {...props} href={href} />;
    }
    throw new Error('Invalid Link config');
  }

  if (prismicLink._linkType === 'Link.document') {
    return <GatsbyLink {...props} to={linkResolver(prismicLink._meta)} />;
  }

  if (prismicLink._linkType === 'Link.web') {
    return <a {...props} href={prismicLink.url} />;
  }
};

export default Link;
