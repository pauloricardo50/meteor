import './PageLinks.scss';

import React from 'react';

import Link from '../Link';

const PageLinks = ({ fields }) => (
  <nav className="page-links container">
    {fields.map(field => (
      <Link
        prismicLink={field.link}
        key={field.label}
        activeClassName="active-link"
        className="page-links-link"
      >
        {field.label}
      </Link>
    ))}
  </nav>
);

export default PageLinks;
