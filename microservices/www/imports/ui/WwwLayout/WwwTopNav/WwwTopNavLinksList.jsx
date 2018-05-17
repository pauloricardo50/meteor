import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';

export const links = ['interests', 'contact', 'about', 'careers'];

const WwwTopNavLinksList = ({ variant }) => (
  <React.Fragment>
    {links.map(link => (
      <Link
        key={link}
        to={`/${link}`}
        className={`www-top-nav-link ${variant}`}
      >
        <h4 className="www-top-nav-link-label">
          <T id={`WwwTopNavLinks.${link}`} />
        </h4>
      </Link>
    ))}
  </React.Fragment>
);

WwwTopNavLinksList.propTypes = {
  variant: PropTypes.string,
};

WwwTopNavLinksList.defaultProps = {
  variant: '',
};

export default WwwTopNavLinksList;
