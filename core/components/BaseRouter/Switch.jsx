import React from 'react';
import PropTypes from 'prop-types';
import { Switch as RRSwitch } from 'react-router-dom';

const Switch = ({ children, ...rest }) => (
  <RRSwitch>
    {/* Check if each child exists before cloning it
      Some routes are conditional, so a child could be Boolean false, which makes React.cloneElement crash */}
    {React.Children.map(
      children,
      child => child && React.cloneElement(child, rest),
    )}
  </RRSwitch>
);

Switch.propTypes = {};

export default Switch;
