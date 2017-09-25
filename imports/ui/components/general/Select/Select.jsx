import React from 'react';
import PropTypes from 'prop-types';

import { FormControl } from 'material-ui/Form';
import MuiSelect from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import Icon from '../Icon';
import MenuItem from '../Material/MenuItem';

const Select = (props) => {
  const { value, handleChange, options, id } = props;
  return (
    <FormControl>
      <InputLabel htmlFor="age-simple">Age</InputLabel>
      <MuiSelect
        value={value}
        onChange={e => handleChange(id, e.target.value)}
        input={<Input id="age-simple" />}
      >
        {options.map((option) => {
          if (React.isValidElement(option)) {
            return option;
          }
          const { optionId, label, icon } = option;
          return (
            <MenuItem value={id} key={optionId}>
              {icon && <Icon type="icon" />}
              {label}
            </MenuItem>
          );
        })}
      </MuiSelect>
    </FormControl>
  );
};

Select.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
};

Select.defaultProps = {
  value: undefined,
};

export default Select;
