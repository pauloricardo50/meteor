import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from '../Material/Tooltip';

const getStyle = ({ color, primaryColor, secondaryColor, style }) => ({
  ...style,
  '--fa-primary-color': primaryColor || color,
  '--fa-secondary-color': secondaryColor || color,
});

const FaIcon = forwardRef(
  (
    { icon, color, primaryColor, secondaryColor, style, tooltip, ...props },
    ref,
  ) => {
    const Icon = (
      <FontAwesomeIcon
        icon={icon}
        color={color}
        style={getStyle({ color, primaryColor, secondaryColor, style })}
        forwardedRef={ref}
        {...props}
      />
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip}>
          <span>{Icon}</span>
        </Tooltip>
      );
    }

    return Icon;
  },
);

export default FaIcon;
