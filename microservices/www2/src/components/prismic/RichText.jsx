import React from 'react';
import { Link } from 'gatsby';
import { RichText as DefaultRichText } from 'prismic-reactjs';

import { linkResolver } from '../../utils/linkResolver';

const GatsbyLink = (type, element, content, children, index) => (
  <Link key={element.data.id} to={linkResolver(element.data)}>
    {content}
  </Link>
);

const RichText = ({ render, ...props }) => (
  <DefaultRichText
    render={render}
    linkResolver={linkResolver}
    serializeHyperlink={GatsbyLink}
    {...props}
  />
);

RichText.asText = DefaultRichText.asText;

export default RichText;
