import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Chip from '../Material/Chip';
import MenuItem from '../Material/MenuItem';
import TextField from '../Material/TextField';
import SelectContainer from './SelectContainer';

const makeRenderValue = ({ multiple, rawOptions }) => {
  if (!multiple) {
    return value => {
      const option = rawOptions.find(({ id }) => id === value);
      return option && option.label;
    };
  }

  return values => (
    <div className="flex wrap">
      {values.map(value => {
        const option = rawOptions.find(({ id }) => id === value);
        return (
          option && (
            <Chip key={option.id} label={option.label} className="m-2" />
          )
        );
      })}
    </div>
  );
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
  className,
  displayEmpty,
  SelectProps,
  ...otherProps
}) => (
  <TextField
    fullWidth={fullWidth}
    style={style}
    className={cx('mui-select', className)}
    select
    SelectProps={{
      multiple,
      renderValue: makeRenderValue({ multiple, rawOptions }),
      displayEmpty:
        typeof displayEmpty === 'boolean' ? displayEmpty : !!placeholder,
      ...SelectProps,
    }}
    value={value}
    onChange={onChange}
    label={label}
    id={id}
    helperText={error}
    error={!!error}
    required={required}
    {...otherProps}
  >
    {[
      placeholder && <MenuItem value="">{placeholder}</MenuItem>,
      ...options,
    ].filter(x => x)}
  </TextField>
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
  value: '',
  label: undefined,
  style: {},
  id: '',
};

export default SelectContainer(Select);
