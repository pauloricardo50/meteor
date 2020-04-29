import React from 'react';
import PropTypes from 'prop-types';

import Waves from 'core/components/Waves';

import WwwFooterCopyright from './WwwFooterCopyright';
import WwwFooterLinks from './WwwFooterLinks';
import WwwFooterSocial from './WwwFooterSocial';
import WwwFooterTop from './WwwFooterTop';

const WwwFooter = ({ transparent, children }) => (
  <footer className="www-footer home-page__footer">
    <Waves noSlope transparent={transparent} height={900} />
    <div className="www-footer-content">
      {children}
      <hr />
      <WwwFooterLinks />
    </div>
    <WwwFooterSocial />
    <WwwFooterCopyright />
  </footer>
);

WwwFooter.propTypes = {
  children: PropTypes.node,
  transparent: PropTypes.bool,
};

WwwFooter.defaultProps = {
  transparent: true,
  children: <WwwFooterTop />,
};

WwwFooter.Top = WwwFooterTop;

export default WwwFooter;
