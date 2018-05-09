import React from 'react';
import PropTypes from 'prop-types';

import WwwTopNavLinksList from './WwwTopNavLinksList';

const WwwTopNavLinksLarge = ({ variant }) => (
  <span className="www-top-nav-links-large">
    <WwwTopNavLinksList variant={variant} />
  </span>
);

WwwTopNavLinksLarge.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default WwwTopNavLinksLarge;
