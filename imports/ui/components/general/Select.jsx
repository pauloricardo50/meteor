import React from 'react';
import PropTypes from 'prop-types';

import SelectField from '/imports/ui/components/general/Material/SelectField';
import MenuItem from '/imports/ui/components/general/Material/MenuItem';

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

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  currentValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

export default Select;
