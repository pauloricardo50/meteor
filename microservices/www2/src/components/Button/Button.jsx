import React from 'react';
import MuiButton from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import { Link } from 'gatsby';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import { compose, mapProps } from 'recompose';

import Icon from 'core/components/Icon';

import { linkResolver } from '../../utils/linkResolver';

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

const getColor = ({ primary, secondary, color, error, warning }) => {
  if (primary) {
    return 'primary';
  }
  if (secondary) {
    return 'secondary';
  }
  if (error) {
    return 'error';
  }
  if (warning) {
    return 'warning';
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

const getContent = ({ icon, fab, label, children, iconAfter }) => {
  if (iconAfter) {
    return (
      <>
        {label || children}
        {icon && !fab && <span style={{ height: '100%', width: 8 }} />}
        {icon}
      </>
    );
  }

  return (
    <>
      {icon}
      {icon && !fab && <span style={{ height: '100%', width: 8 }} />}
      {label || children}
    </>
  );
};

const getStartIcon = ({ icon, iconAfter }) => {
  if (!iconAfter) {
    return icon;
  }
};

const getButtonContent = props => {
  if (props.fab) {
    return getContent(props);
  }

  return props.label || props.children;
};

const getLinkProps = prismicLink => {
  if (!prismicLink) {
    return {};
  }

  if (prismicLink._linkType === 'Link.document') {
    return {
      to: linkResolver(prismicLink._meta),
      component: Link,
    };
  }
  if (prismicLink._linkType === 'Link.web') {
    return {
      href: prismicLink.url,
      component: 'a',
    };
  }
};

const Button = ({ prismicLink, onTrack, onClick, ...props }) => {
  const childProps = omit(props, [
    'iconAfter',
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
  const startIcon = props.icon && getStartIcon(props);
  const Comp = props.fab ? Fab : MuiButton;

  const linkProps = getLinkProps(prismicLink);

  const handleClick = event => {
    let result;

    if (onClick) {
      result = onClick(event);
    }
    if (onTrack) {
      onTrack({ toPath: linkProps?.to || linkProps?.href });
    }

    return result;
  };

  const button = (
    <Comp
      {...childProps}
      {...linkProps}
      color={color}
      variant={variant}
      className={cx(
        {
          [props.classes.root]: color === 'error',
          [props.classes.raised]: !!(color === 'error' && variant === 'raised'),
        },
        props.className,
      )}
      role="button"
      startIcon={startIcon}
      endIcon={props.iconAfter && props.icon}
      onClick={handleClick}
    >
      {getButtonContent(props)}
    </Comp>
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

    return (
      <Tooltip title={props.tooltip} placement={props.tooltipPlacement}>
        {button}
      </Tooltip>
    );
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
  loading
    ? {
        ...props,
        disabled: true,
        icon: <Icon type="loop-spin" />,
        children: props.fab ? null : props.children,
      }
    : props,
);

export default compose(withLoadingProp, withStyles(styles))(Button);
