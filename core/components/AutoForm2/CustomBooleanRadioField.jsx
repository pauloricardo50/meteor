import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioMaterial from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import wrapField from 'uniforms-material/wrapField';

import T from '../Translation';

const stringToBool = string => {
  if (string) {
    return string === 'true';
  }
  return undefined;
};

const CustomBooleanRadioField = ({
  checkboxes, // eslint-disable-line no-unused-vars
  disabled,
  id,
  inputRef,
  label,
  name,
  onChange,
  value,
  ...props
}) => {
  const filteredProps = wrapField._filterDOMProps(filterDOMProps(props));
  const allowedValues = [true, false];

  return wrapField(
    { ...props, disabled, component: 'fieldset' },
    label && (
      <FormLabel component="legend" htmlFor={name}>
        {label}
      </FormLabel>
    ),
    <RadioGroup
      id={id}
      name={name}
      onChange={event => disabled || onChange(stringToBool(event.target.value))}
      ref={inputRef}
      value={value}
      row
    >
      {allowedValues.map(item => (
        <FormControlLabel
          control={<RadioMaterial {...filteredProps} />}
          key={item}
          label={item ? <T id="general.yes" /> : <T id="general.no" />}
          value={item}
        />
      ))}
    </RadioGroup>,
  );
};

CustomBooleanRadioField.defaultProps = {
  fullWidth: true,
  margin: 'dense',
};

export default connectField(CustomBooleanRadioField);
