import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MuiIconButton from 'material-ui/IconButton';
import Icon from '../Icon';
import Tooltip from 'material-ui/Tooltip';

// Keep this a class to avoid warnings from IconMenu which adds a ref to this
// component
export default class IconButton extends Component {
  constructor(props) {
    super(props);
    // To avoid linter warnings
    this.state = {};
  }

  render() {
    const {
      onClick,
      type,
      tooltip,
      tooltipPlacement,
      style,
      iconStyle,
      iconProps,
    } = this.props;

    const button = (
      <MuiIconButton
        onClick={onClick}
        style={style}
        className="icon-button"
        aria-label={tooltip || undefined}
      >
        <Icon type={type} style={iconStyle} {...iconProps} />
      </MuiIconButton>
    );

    if (tooltip) {
      return (
        <Tooltip placement={tooltipPlacement} title={tooltip}>
          {button}
        </Tooltip>
      );
    }
    return button;
  }
}

IconButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
  tooltipPlacement: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  iconStyle: PropTypes.object,
  iconProps: PropTypes.object,
};

IconButton.defaultProps = {
  onClick: () => {},
  tooltip: null,
  tooltipPlacement: 'bottom',
  style: {},
  iconStyle: {},
  iconProps: {},
};
