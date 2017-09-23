import React from 'react';
import PropTypes from 'prop-types';

import omit from 'lodash/omit';

// import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton'
import MuiButton from 'material-ui/Button';

const getColor = ({ primary, secondary }) => {
  if (primary) {
    return 'primary';
  } else if (secondary) {
    return 'accent';
  }

  return '';
};

const Button = (props) => {
  const childProps = omit(props, ['primary', 'secondary', 'label']);

  return (
    <MuiButton {...childProps} color={getColor(props)}>
      {props.label || props.children}
    </MuiButton>
  );
};

Button.propTypes = {
  raised: PropTypes.bool,
};

Button.defaultProps = {
  raised: false,
};

export default Button;
