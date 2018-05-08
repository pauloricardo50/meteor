import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { VARIANTS } from './WwwTopNav';

const WwwTopNavLogo = ({ variant }) => (
  <Link to="/" className="www-top-nav-logo">
    <img
      src={
        variant === VARIANTS.BLUE
          ? '/img/logo_white.svg'
          : '/img/logo_black.svg'
      }
      alt="e-Potek"
    />
  </Link>
);

WwwTopNavLogo.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default WwwTopNavLogo;
