import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';

import MuiSelect from '../Material/Select';
import FormHelperText from '../Material/FormHelperText';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';
import FormControl from '../Material/FormControl';
import Input from '../Material/Input';
import SelectContainer from './SelectContainer';

const makeRenderValue = ({ multiple, rawOptions }) => {
  if (!multiple) {
    return (value) => {
      const option = rawOptions.find(({ id }) => id === value);
      return option && option.label;
    };
  }

  return values =>
    values.map((value, i) => {
      const option = rawOptions.find(({ id }) => id === value);
      return [i !== 0 && ', ', option && option.label];
    });
};

const Select = ({
  value,
  onChange,
  options,
  id,
  label,
  style,
  required,
  error,
  placeholder,
  multiple,
  rawOptions,
  fullWidth,
  ...otherProps
}) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);

  return (
    <FormControl
      fullWidth={fullWidth}
      variant="outlined"
      className="mui-select"
      style={style}
    >
      {label && (
        <InputLabel ref={inputLabelRef} htmlFor={id}>
          {label}
          {required && ' '}
          {required && <span className="error">*</span>}
        </InputLabel>
      )}
      <MuiSelect
        renderValue={makeRenderValue({ multiple, rawOptions })}
        {...otherProps}
        value={value}
        onChange={onChange}
        input={<Input labelWidth={labelWidth} id={id} />}
        multiple={multiple}
        displayEmpty={!!placeholder}
      >
        {[
          placeholder && <MenuItem value="">{placeholder}</MenuItem>,
          ...options,
        ].filter(x => x)}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Select.defaultProps = {
  value: '',
  label: undefined,
  style: {},
  id: '',
};

export default SelectContainer(Select);
