import React from 'react';
import PropTypes from 'prop-types';

import Radio, {
  RadioGroup,
} from '/imports/ui/components/general/Material/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

import { T } from '/imports/ui/components/general/Translation';

const safeChange = (value, id, onChange, options) => {
  // If all options are booleans, transform the onChange handler's value
  // to booleans
  if (options.every(o => typeof o === 'boolean' || typeof o.id === 'boolean')) {
    return onChange(id, value === 'true');
  }
  return onChange(id, value);
};

// Cast value to strings, so that is plays nicely with material-ui,
// in the onChange handler, convert back to boolean
const RadioButtons = ({
  options,
  onChange,
  id,
  intlPrefix,
  value,
  label,
  style,
  disabled,
}) => (
  <FormControl style={style} className="mui-radio-group">
    <FormLabel htmlFor={id}>{label}</FormLabel>
    <RadioGroup
      onChange={(event, newValue) =>
        safeChange(newValue, id, onChange, options)}
      value={`${value}`}
      name={id}
      className="flex"
      style={{ justifyContent: 'flex-start' }}
    >
      {options.map(option => (
        <FormControlLabel
          control={<Radio />}
          key={option.id || option}
          value={`${option.id !== undefined ? option.id : option}`}
          label={option.label || <T id={`${intlPrefix}.${option}`} />}
          disabled={disabled}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

RadioButtons.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  intlPrefix: PropTypes.string,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

RadioButtons.defaultProps = {
  label: '',
  style: {},
  value: undefined,
  intlPrefix: '',
  disabled: false,
};

export default RadioButtons;
