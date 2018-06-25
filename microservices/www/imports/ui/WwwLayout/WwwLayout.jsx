import React from 'react';
import PropTypes from 'prop-types';
import WwwTopNav from './WwwTopNav';
import WwwFooter from './WwwFooter';
import WwwContent from './WwwContent';

const WwwLayout = ({ children, className }) => (
  <div className={`www-layout animated fadeIn ${className}`}>{children}</div>
);
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
