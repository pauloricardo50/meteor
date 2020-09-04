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
  error,
  ...props
}) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);
  const finalHelperText = helperText || error?.message;

  return (
    <FormControl required={required} fullWidth={fullWidth} error={!!error}>
      <InputLabel ref={inputLabelRef}>{label}</InputLabel>
      <NumberInput labelWidth={labelWidth} {...props} />
      {finalHelperText && <FormHelperText>{finalHelperText}</FormHelperText>}
    </FormControl>
  );
};

export default NumberField;
