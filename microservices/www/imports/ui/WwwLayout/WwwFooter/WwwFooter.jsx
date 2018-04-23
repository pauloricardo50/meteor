import React from 'react';
import PropTypes from 'prop-types';

import Waves from '../../components/Waves';
import WwwFooterTop from './WwwFooterTop';
import WwwFooterLinks from './WwwFooterLinks';
import WwwFooterCopyright from './WwwFooterCopyright';
import WwwFooterSocial from './WwwFooterSocial';

const WwwFooter = ({ transparent, children }) => (
  <footer className="www-footer">
    <Waves noSlope transparent={transparent} />
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
  transparent: PropTypes.bool,
  children: PropTypes.node,
};

WwwFooter.defaultProps = {
  transparent: true,
  children: <WwwFooterTop />,
};

WwwFooter.Top = WwwFooterTop;

export default WwwFooter;
