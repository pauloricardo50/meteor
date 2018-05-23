import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import omit from 'lodash/omit';
import MuiButton from '@material-ui/core/Button';

const getColor = ({ primary, secondary, color }) => {
  if (primary) {
    return 'primary';
  } else if (secondary) {
    return 'secondary';
  }

  return color;
};

const Button = (props) => {
  const childProps = omit(props, [
    'primary',
    'secondary',
    'label',
    'icon',
    'link',
    'raised',
  ]);

  return (
    <MuiButton
      {...childProps}
      color={props.color || getColor(props)}
      variant={
        props.variant || (props.raised ? 'raised' : undefined) || undefined
      }
      component={props.component || (props.link ? Link : null)}
      to={props.to || undefined}
    >
      {props.icon}
      {props.icon && <span style={{ height: '100%', width: 8 }} />}
      {props.label || props.children}
    </MuiButton>
  );
};

Button.propTypes = {
  raised: PropTypes.bool,
  link: PropTypes.bool,
  icon: PropTypes.node,
  label: PropTypes.node,
  children: PropTypes.node,
};

Button.defaultProps = {
  raised: false,
  link: false,
};

export default Button;
