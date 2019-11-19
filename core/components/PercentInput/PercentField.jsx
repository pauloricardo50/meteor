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

// A hack for number inputs because material-ui can't be sure of the initial
// shrink value: https://material-ui.com/components/text-fields/#floating-label
const shouldShrinkLabel = value => !!value || undefined;

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
      <InputLabel ref={inputLabelRef} shrink={shouldShrinkLabel(props.value)}>
        {label}
      </InputLabel>
      <PercentInput
        labelWidth={labelWidth}
        notched={shouldShrinkLabel(props.value)}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PercentField;
