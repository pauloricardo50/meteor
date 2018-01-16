import React from 'react';
import PropTypes from 'prop-types';
import { Switch as RRSwitch } from 'react-router-dom';

const Switch = ({ children, ...rest }) => (
  <RRSwitch>
    {React.Children.map(children, child => React.cloneElement(child, rest))}
  </RRSwitch>
);

Switch.propTypes = {};

export default Switch;
