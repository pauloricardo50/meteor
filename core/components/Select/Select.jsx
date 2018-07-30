import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import MuiSelect from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import SelectContainer from './SelectContainer';

const Select = ({
  value,
  onChange,
  options,
  id,
  label,
  style,
  ...otherProps
}) => (
  <FormControl className="mui-select" style={style}>
    {label && (
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>
    )}
    <MuiSelect
      {...otherProps}
      value={value}
      onChange={e => onChange(id, e.target.value)}
      id={id}
    >
      {options}
    </MuiSelect>
  </FormControl>
);

Select.propTypes = {
  classes: PropTypes.object.isRequired,
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
