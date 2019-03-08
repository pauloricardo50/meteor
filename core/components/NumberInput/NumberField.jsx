// @flow
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import NumberInput from './NumberInput';

type NumberFieldProps = {
  fullWidth?: boolean,
  label?: React.Node,
  helperText?: React.Node,
  required?: boolean,
};

const NumberField = ({
  fullWidth = true,
  helperText,
  label,
  required,
  ...props
}: NumberFieldProps) => (
  <FormControl required={required} fullWidth={fullWidth}>
    <InputLabel>{label}</InputLabel>
    <NumberInput {...props} />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export default NumberField;
