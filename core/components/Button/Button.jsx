import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import omit from 'lodash/omit';
import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Tooltip from '@material-ui/core/Tooltip';
import { mapProps, compose } from 'recompose';
import cx from 'classnames';

import Icon from 'core/components/Icon';

const styles = theme => ({
  root: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    '&$raised': {
      color: theme.palette.error.contrastText,
      backgroundColor: theme.palette.error.main,
    },
    '&:hover': {
      backgroundColor: fade(
        theme.palette.text.primary,
        theme.palette.action.hoverOpacity,
      ),
    },
  },
  raised: {},
});

const getColor = ({ primary, secondary, color, error }) => {
  if (primary) {
    return 'primary';
  }
  if (secondary) {
    return 'secondary';
  }
  if (error) {
    return 'error';
  }

  return color;
};

const getVariant = ({ raised, outlined }) => {
  if (raised) {
    return 'contained';
  }
  if (outlined) {
    return 'outlined';
  }
  return undefined;
};

const Button = (props) => {
  const childProps = omit(props, [
    'primary',
    'secondary',
    'label',
    'icon',
    'link',
    'raised',
    'outlined',
    'error',
    'classes',
  ]);

  const variant = props.variant || getVariant(props);
  const color = props.color || getColor(props);

  const button = (
    <MuiButton
      {...childProps}
      color={color}
      variant={variant}
      component={props.component || (props.link ? Link : 'button')}
      to={props.to || undefined}
      className={cx(props.className, {
        [props.classes.root]: color === 'error',
        [props.classes.raised]: !!(color === 'error' && variant === 'raised'),
      })}
    >
      {props.icon}
      {props.icon && <span style={{ height: '100%', width: 8 }} />}
      {props.label || props.children}
    </MuiButton>
  );

  if (props.tooltip) {
    if (props.disabled) {
      // When the button is disabled, it does not trigger pointer-events,
      // so a tooltip will not appear
      // Careful with styling here, as the additional span might break layouts
      return (
        <Tooltip title={props.tooltip}>
          <span>{button}</span>
        </Tooltip>
      );
    }

    return <Tooltip title={props.tooltip}>{button}</Tooltip>;
  }

  return button;
};

Button.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  label: PropTypes.node,
  link: PropTypes.bool,
  raised: PropTypes.bool,
};

Button.defaultProps = {
  raised: false,
  link: false,
};

const withLoadingProp = mapProps(({ loading, ...props }) =>
  (loading
    ? { ...props, disabled: true, icon: <Icon type="loop-spin" /> }
    : props));

export default compose(
  withLoadingProp,
  withStyles(styles),
)(Button);
