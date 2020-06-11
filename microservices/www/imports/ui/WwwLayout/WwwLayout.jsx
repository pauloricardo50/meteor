import React from 'react';
import PropTypes from 'prop-types';

import SimpleContactButton from 'core/components/ContactButton/SimpleContactButton';
import useIntercom from 'core/hooks/useIntercom';

import WwwContent from './WwwContent';
import WwwFooter from './WwwFooter';
import WwwTopNav from './WwwTopNav';

const WwwLayout = ({ children, className }) => {
  useIntercom();
  return (
    <div className={`www-layout animated fadeIn ${className}`}>
      {children}
      <SimpleContactButton style={{ width: '250px', fontSize: '0.875rem' }} />
    </div>
  );
};
WwwLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

WwwLayout.defaultProps = {
  className: '',
};

WwwLayout.TopNav = WwwTopNav;
WwwLayout.Footer = WwwFooter;
WwwLayout.Content = WwwContent;

export default WwwLayout;
