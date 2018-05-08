import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';
import togglePoint, { TOGGLE_POINTS } from 'core/api/features/togglePoint';

const modifier = togglePoint(TOGGLE_POINTS.ROUTES_NOT_PRODUCTION_READY);
const links = [...modifier(['interests'])];

const WwwTopNavLinks = ({ variant }) => (
  <span className="www-top-nav-links">
    {links.map(link => (
      <Link
        to={`/${link}`}
        key={link}
        className={`www-top-nav-link ${variant}`}
      >
        <h3 className="www-top-nav-link-label">
          <T id={`WwwTopNavLinks.${link}`} />
        </h3>
      </Link>
    ))}
  </span>
);

WwwTopNavLinks.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default WwwTopNavLinks;
