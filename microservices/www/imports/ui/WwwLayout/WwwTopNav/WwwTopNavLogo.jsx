import React from 'react';
import PropTypes from 'prop-types';

import Link from 'core/components/Link';

import { VARIANTS } from './WwwTopNav';

const WwwTopNavLogo = ({ variant }) => (
  <Link to="/" className="www-top-nav-logo logo">
    <img
      src={
        variant === VARIANTS.BLUE
          ? '/img/logo_square_white.svg'
          : '/img/logo_square_black.svg'
      }
      alt="e-Potek"
      className="logo-home"
    />
  </Link>
);

WwwTopNavLogo.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default WwwTopNavLogo;
