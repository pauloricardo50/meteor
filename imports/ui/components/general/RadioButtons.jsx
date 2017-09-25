import React from 'react';
import PropTypes from 'prop-types';

import Radio, {
  RadioGroup,
} from '/imports/ui/components/general/Material/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

import { T } from '/imports/ui/components/general/Translation';

const RadioButtons = ({
  options,
  handleChange,
  id,
  intlPrefix,
  currentValue,
  label,
  style,
}) => (
  <FormControl style={style}>
    <FormLabel htmlFor={id}>{label}</FormLabel>
    <RadioGroup
      onChange={(event, value) => handleChange(id, value)}
      value={currentValue}
      name={id}
      className="flex"
      style={{ justifyContent: ' space-around' }}
    >
      {options.map(option => (
        <FormControlLabel
          control={Radio}
          key={option}
          value={option}
          label={<T id={`${intlPrefix}.${option}`} />}
          // style={{ width: 'unset' }}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

RadioButtons.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  intlPrefix: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  currentValue: PropTypes.any,
  style: PropTypes.object,
};

RadioButtons.defaultProps = {
  label: '',
  style: {},
  currentValue: undefined,
};

export default RadioButtons;
