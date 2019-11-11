import React from 'react';
import PropTypes from 'prop-types';

import WwwTopNavLinksSmall from './WwwTopNavLinksSmall';
import WwwTopNavLinksLarge from './WwwTopNavLinksLarge';

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
