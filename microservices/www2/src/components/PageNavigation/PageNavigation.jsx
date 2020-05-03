import React from 'react';
import './PageNavigation.scss';

const PageNavigation = ({ fields }) => (
  <nav className="page-navigation container">
    {fields.length > 0 && (
      <ul>
        {fields.map((field, idx) => (
          <li key={idx}>
            <a href={`#${field.section_link}`}>{field.link_text}</a>
          </li>
        ))}
      </ul>
    )}
  </nav>
);

export default PageNavigation;
