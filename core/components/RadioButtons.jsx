import React from 'react';
import PropTypes from 'prop-types';

import Radio, { RadioGroup } from 'core/components/Material/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import T from 'core/components/Translation';

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
    {React.isValidElement(label) && <FormLabel htmlFor={id}>{label}</FormLabel>}
    <RadioGroup
      onChange={(event, newValue) =>
        safeChange(newValue, id, onChange, options)
      }
      value={`${value}`}
      name={id}
      className="flex"
      style={{ justifyContent: 'flex-start', flexDirection: 'row' }}
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
  disabled: PropTypes.bool,
  id: PropTypes.string,
  intlPrefix: PropTypes.string,
  label: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.object,
  value: PropTypes.any,
};

RadioButtons.defaultProps = {
  label: '',
  style: {},
  value: undefined,
  intlPrefix: '',
  disabled: false,
};

export default RadioButtons;
