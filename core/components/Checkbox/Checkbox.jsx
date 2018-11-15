import React from 'react';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';

const Checkbox = ({ value, onChange, id, ...props }) => (
  <FormControlLabel
    control={<MuiCheckbox checked={value} onChange={onChange} value={id} />}
    {...props}
  />
);

Checkbox.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

Checkbox.defaultProps = {
  id: undefined,
  label: undefined,
  disabled: false,
};

export default Checkbox;
