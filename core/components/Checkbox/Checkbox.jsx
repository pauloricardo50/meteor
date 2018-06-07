import React from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';

const Checkbox = ({ value, onChange, label, id, disabled, style }) => (
  <FormControlLabel
    control={<MuiCheckbox checked={value} onChange={onChange} value={id} />}
    label={label}
    disabled={disabled}
    style={style}
  />
);

Checkbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  id: undefined,
  label: undefined,
  disabled: false,
};

export default Checkbox;
