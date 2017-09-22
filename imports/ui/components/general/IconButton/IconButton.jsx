import React from 'react';
import PropTypes from 'prop-types';

import MuiIconButton from 'material-ui/IconButton';
import Icon from '../Icon';

const IconButton = ({
  onClick,
  type,
  tooltip,
  tooltipPosition,
  touch,
  style,
  iconStyle,
  iconProps,
}) => (
  <MuiIconButton
    onClick={onClick}
    tooltip={tooltip}
    tooltipPosition={tooltipPosition}
    touch={touch}
    style={style}
  >
    <Icon type={type} withColors style={iconStyle} {...iconProps} />
  </MuiIconButton>
);

IconButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
  touch: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
};

IconButton.defaultProps = {
  onClick: () => {},
  tooltip: '',
  touch: true,
  style: {},
};

export default IconButton;
