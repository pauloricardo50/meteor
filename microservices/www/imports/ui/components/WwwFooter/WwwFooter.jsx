import React from 'react';
import PropTypes from 'prop-types';

import Waves from '../../components/Waves';
import WwwFooterTop from './WwwFooterTop';
import WwwFooterLinks from './WwwFooterLinks';
import WwwFooterCopyright from './WwwFooterCopyright';
import WwwFooterSocial from './WwwFooterSocial';

const WwwFooter = ({ transparent }) => (
  <footer>
    <Waves noSlope transparent={transparent} />
    <div className="page-footer-content">
      <WwwFooterTop />
      <hr />
      <WwwFooterLinks />
    </div>
    <WwwFooterSocial />
    <WwwFooterCopyright />
  </footer>
);

WwwFooter.propTypes = {
  transparent: PropTypes.bool,
};

WwwFooter.defaultProps = {
  transparent: true,
};

export default WwwFooter;
