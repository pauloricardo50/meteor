import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getStyle = ({ color, primaryColor, secondaryColor, style }) => ({
  ...style,
  '--fa-primary-color': primaryColor || color,
  '--fa-secondary-color': secondaryColor || color,
});

const FaIcon = ({
  icon,
  color,
  primaryColor,
  secondaryColor,
  style,
  ...props
}) => (
  <FontAwesomeIcon
    icon={icon}
    color={color}
    style={getStyle({ color, primaryColor, secondaryColor, style })}
    {...props}
  />
);

export default FaIcon;
