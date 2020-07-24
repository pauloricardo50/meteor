import './PageNavigation.scss';

import React from 'react';
import { Link } from 'react-scroll';

import useMedia from 'core/hooks/useMedia';

const PageNavigation = ({ fields }) => {
  const isMobile = useMedia({ maxWidth: 768 });

  return (
    <nav className="page-links container">
      {fields.map(field => (
        <Link
          prismicLink={field.link}
          key={field.label}
          className="page-links-link"
          to={field.section_link}
          spy
          ignoreCancelEvents={false}
          smooth
          offset={isMobile ? -64 : -96}
        >
          {field.link_text}
        </Link>
      ))}
    </nav>
  );
};

export default PageNavigation;
