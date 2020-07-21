import React from 'react';
import { Link } from 'gatsby';
import { RichText as DefaultRichText } from 'prismic-reactjs';

import { linkResolver } from '../../utils/linkResolver';

const GatsbyLink = (type, element, content, children, index) => {
  if (element.data.link_type === 'Web') {
    return (
      <a
        key={element.data.url}
        href={element.data.url}
        target={element.data.target}
      >
        {content}
      </a>
    );
  }

  return (
    <Link key={element.data.id} to={linkResolver(element.data)}>
      {content}
    </Link>
  );
};

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
