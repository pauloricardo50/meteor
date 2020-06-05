import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getStyle = ({ color, primaryColor, secondaryColor, style }) => ({
  ...style,
  '--fa-primary-color': primaryColor || color,
  '--fa-secondary-color': secondaryColor || color,
});

const FaIcon = forwardRef(
  ({ icon, color, primaryColor, secondaryColor, style, ...props }, ref) => (
    <FontAwesomeIcon
      icon={icon}
      color={color}
      style={getStyle({ color, primaryColor, secondaryColor, style })}
      forwardedRef={ref}
      {...props}
    />
  ),
);

export default FaIcon;
