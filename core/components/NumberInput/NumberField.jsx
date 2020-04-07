import React from 'react';

import FormControl from '../Material/FormControl';
import FormHelperText from '../Material/FormHelperText';
import InputLabel, { useInputLabelWidth } from '../Material/Input';
import NumberInput from './NumberInput';

const NumberField = ({
  fullWidth = true,
  helperText,
  label,
  required,
  ...props
}) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);

  return (
    <FormControl required={required} fullWidth={fullWidth}>
      <InputLabel ref={inputLabelRef}>{label}</InputLabel>
      <NumberInput labelWidth={labelWidth} {...props} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default NumberField;
