import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiIconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { capitalize } from '@material-ui/core/utils';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';

const styles = theme => ({
  sizeSmall: {
    padding: 3,
    fontSize: theme.typography.pxToRem(18),
  },
  sizeTiny: {
    padding: 2,
    fontSize: theme.typography.pxToRem(12),
  },
});

// Keep this a class to avoid warnings from IconMenu which adds a ref to this
// component
class IconButton extends Component {
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
      disabled,
      classes,
      size = 'medium',
      className,
      loading,
      controlledTooltipProps = {},
      ...rest
    } = this.props;

    const button = (
      <MuiIconButton
        onClick={onClick}
        style={style}
        className={cx(
          'icon-button',
          { [classes[`size${capitalize(size)}`]]: size !== 'medium' },
          !loading && className,
        )}
        aria-label={tooltip || undefined}
        disabled={disabled || loading}
        {...rest}
      >
        <Icon
          type={loading ? 'loop-spin' : type}
          style={iconStyle}
          fontSize="inherit"
          {...iconProps}
        />
      </MuiIconButton>
    );

    if (tooltip) {
      return (
        <Tooltip
          placement={tooltipPlacement}
          title={tooltip}
          {...controlledTooltipProps}
        >
          {button}
        </Tooltip>
      );
    }
    return button;
  }
}

IconButton.propTypes = {
  disabled: PropTypes.bool,
  iconProps: PropTypes.object,
  iconStyle: PropTypes.object,
  onClick: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
  tooltip: PropTypes.node,
  tooltipPlacement: PropTypes.string,
  type: PropTypes.string.isRequired,
};

IconButton.defaultProps = {
  onClick: () => {},
  tooltip: null,
  tooltipPlacement: 'bottom',
  style: {},
  iconStyle: {},
  iconProps: {},
  disabled: false,
};

export default withStyles(styles)(IconButton);
