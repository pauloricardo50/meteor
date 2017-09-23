import React from 'react';
import PropTypes from 'prop-types';

// import RaisedButton from 'material-ui/RaisedButton';
// import FlatButton from 'material-ui/FlatButton';
import MuiButton from 'material-ui/Button';

const Button = (props) => {
  // error complains about unknown "raised" prop if this isn't done
  const childProps = { ...props };
  delete childProps.raised;

  if (props.raised) {
    return <MuiButton raised {...childProps} />;
  }

  return <MuiButton {...childProps} />;
};

Button.propTypes = {
  raised: PropTypes.bool,
};

Button.defaultProps = {
  raised: false,
};

export default Button;
