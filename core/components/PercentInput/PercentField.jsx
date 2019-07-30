// @flow
import React from 'react';

import FormHelperText from '../Material/FormHelperText';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';
import FormControl from '../Material/FormControl';
import PercentInput from './PercentInput';

type PercentFieldProps = {
  fullWidth?: boolean,
  label?: React.Node,
  helperText?: React.Node,
  required?: boolean,
};

const PercentField = ({
  fullWidth = true,
  helperText,
  label,
  required,
  margin,
  ...props
}: PercentFieldProps) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);

  return (
    <FormControl required={required} fullWidth={fullWidth} margin={margin}>
      <InputLabel ref={inputLabelRef}>{label}</InputLabel>
      <PercentInput labelWidth={labelWidth} {...props} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PercentField;
