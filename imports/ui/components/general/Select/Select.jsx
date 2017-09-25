import React from 'react';
import PropTypes from 'prop-types';

import omit from 'lodash/omit';

import { FormControl } from 'material-ui/Form';
import MuiSelect from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import Icon from '../Icon';
import MenuItem from '../Material/MenuItem';

const Select = (props) => {
  const { value, handleChange, options, id, label } = props;
  return (
    <FormControl>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <MuiSelect
        {...omit(props, ['value', 'handleChange', 'id', 'label'])}
        value={value}
        onChange={e => handleChange(id, e.target.value)}
        input={<Input id={id} />}
      >
        {options.map((option) => {
          // If a component is provided, return the component
          if (React.isValidElement(option)) {
            return option;
          }
          const { id: optionId, label: optionLabel, icon } = option;
          return (
            <MenuItem value={optionId} key={optionId}>
              {icon && <Icon type={icon} />}
              {optionLabel}
            </MenuItem>
          );
        })}
      </MuiSelect>
    </FormControl>
  );
};

Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
};

Select.defaultProps = {
  value: undefined,
  label: undefined,
};

export default Select;
