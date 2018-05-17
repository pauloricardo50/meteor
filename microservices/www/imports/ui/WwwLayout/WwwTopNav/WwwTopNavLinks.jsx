import React from 'react';
import PropTypes from 'prop-types';

import WwwTopNavLinksSmall from './WwwTopNavLinksSmall';
import WwwTopNavLinksLarge from './WwwTopNavLinksLarge';

const WwwTopNavLinks = ({ variant }) => (
  <React.Fragment>
    <WwwTopNavLinksSmall />
    <WwwTopNavLinksLarge variant={variant} />
  </React.Fragment>
);

WwwTopNavLinks.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default WwwTopNavLinks;
