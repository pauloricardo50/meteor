import React from 'react';
import cx from 'classnames';

import Chip from '../Material/Chip';
import MenuItem from '../Material/MenuItem';
import TextField from '../Material/TextField';
import { mapSelectOptions } from './selectHelpers';

const makeRenderValue = ({ multiple, options }) => {
  if (!multiple) {
    return value => {
      const option = options.find(({ id }) => id === value);
      return option && option.label;
    };
  }

  return values => (
    <div className="flex wrap">
      {values.map(value => {
        const option = options.find(({ id }) => id === value);
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
  fullWidth,
  className,
  displayEmpty,
  SelectProps,
  renderValue = makeRenderValue({ multiple, options }),
  grouping,
  ...otherProps
}) => {
  const handleChange = e => onChange(e.target.value, id);
  const formattedOptions = mapSelectOptions(options, grouping);

  return (
    <TextField
      fullWidth={fullWidth}
      style={style}
      className={cx('mui-select', className)}
      select
      SelectProps={{
        multiple,
        renderValue,
        displayEmpty:
          typeof displayEmpty === 'boolean' ? displayEmpty : !!placeholder,
        ...SelectProps,
      }}
      value={value}
      onChange={handleChange}
      label={label}
      id={id}
      helperText={error}
      error={!!error}
      required={required}
      {...otherProps}
    >
      {[
        placeholder && <MenuItem value="">{placeholder}</MenuItem>,
        ...formattedOptions,
      ].filter(x => x)}
    </TextField>
  );
};

export default Select;
