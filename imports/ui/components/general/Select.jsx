import React from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const Select = ({ id, label, currentValue, onChange, options, style }) => (
  <SelectField
    floatingLabelText={label}
    value={currentValue}
    onChange={(event, index, value) => onChange(id, value)}
    style={style}
  >
    {options.map(option => (
      <MenuItem value={option.id} primaryText={option.label} key={option.id} />
    ))}
  </SelectField>
);

Select.propTypes = {};

export default Select;
