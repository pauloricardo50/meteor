import React from 'react';
import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';

const Checkbox = ({ value, onChange, id, ...props }) => (
  <FormControlLabel
    control={
      <MuiCheckbox
        className="checkbox"
        checked={value}
        onChange={onChange}
        value={id}
      />
    }
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
