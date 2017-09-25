import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import omit from 'lodash/omit';

// import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton'
import MuiButton from 'material-ui/Button';

const getColor = ({ primary, secondary, color }) => {
  if (primary) {
    return 'primary';
  } else if (secondary) {
    return 'accent';
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
  ]);

  return (
    <MuiButton
      {...childProps}
      color={getColor(props)}
      component={props.link ? Link : null}
    >
      {props.icon}
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
