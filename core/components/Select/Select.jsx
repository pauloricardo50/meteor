import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import SelectContainer from './SelectContainer';

const Select = ({
  value,
  onChange,
  options,
  id,
  label,
  style,
  required,
  error,
  ...otherProps
}) => (
  <FormControl className="mui-select" style={style}>
    {label && (
      <InputLabel htmlFor={id} shrink>
        {required ? (
          <span>
            {label} <span className="error">*</span>
          </span>
        ) : (
          label
        )}
      </InputLabel>
    )}
    <MuiSelect {...otherProps} value={value} onChange={onChange} id={id}>
      {options}
    </MuiSelect>
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Select.defaultProps = {
  value: undefined,
  label: undefined,
  style: {},
  id: '',
};

export default SelectContainer(Select);
