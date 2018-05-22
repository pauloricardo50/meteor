import React from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const Toggle = ({ toggled, onToggle, label, ...otherProps }) => (
  <FormControlLabel
    control={<Switch checked={toggled} onChange={onToggle} />}
    label={label}
    {...otherProps}
  />
);

Toggle.propTypes = {
  toggled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  label: PropTypes.node,
};

Toggle.defaultProps = {
  label: undefined,
};

export default Toggle;
