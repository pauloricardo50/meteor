import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getStyle = (primaryColor, secondaryColor, style) => ({
  ...style,
  ...(primaryColor ? { '--fa-primary-color': primaryColor } : {}),
  ...(secondaryColor ? { '--fa-secondary-color': secondaryColor } : {}),
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
    style={getStyle(primaryColor, secondaryColor, style)}
    {...props}
  />
);

export default FaIcon;
