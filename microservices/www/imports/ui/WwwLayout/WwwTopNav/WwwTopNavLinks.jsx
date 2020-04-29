import React from 'react';
import PropTypes from 'prop-types';

import WwwTopNavLinksLarge from './WwwTopNavLinksLarge';
import WwwTopNavLinksSmall from './WwwTopNavLinksSmall';

const WwwTopNavLinks = ({ variant }) => (
  <>
    <WwwTopNavLinksSmall />
    <WwwTopNavLinksLarge variant={variant} />
  </>
);

WwwTopNavLinks.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default WwwTopNavLinks;
