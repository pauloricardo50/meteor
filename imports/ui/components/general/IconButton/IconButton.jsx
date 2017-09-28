import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MuiIconButton from 'material-ui/IconButton';
import Icon from '../Icon';

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
      tooltipPosition,
      touch,
      style,
      iconStyle,
      iconProps,
    } = this.props;
    return (
      <MuiIconButton
        onClick={onClick}
        style={style}
        className="icon-button"
        // tooltip={tooltip}
        // tooltipPosition={tooltipPosition}
        // touch={touch}
      >
        <Icon type={type} style={iconStyle} {...iconProps} />
      </MuiIconButton>
    );
  }
}

IconButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
  touch: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
};

IconButton.defaultProps = {
  onClick: () => {},
  tooltip: undefined,
  touch: undefined,
  style: {},
};
