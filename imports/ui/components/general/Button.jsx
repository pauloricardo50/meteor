import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const Button = (props) => {
  // error complains about unknown "raised" prop if this isn't done
  const childProps = { ...props };
  delete childProps.raised;

  if (props.raised) {
    return <RaisedButton {...childProps} />;
  }

  return <FlatButton {...childProps} />;
};

Button.propTypes = {
  raised: PropTypes.bool,
};

Button.defaultProps = {
  raised: false,
};

export default Button;
