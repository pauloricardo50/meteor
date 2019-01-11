// @flow
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

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
  ...props
}: PercentFieldProps) => (
  <FormControl required={required} fullWidth={fullWidth}>
    <InputLabel>{label}</InputLabel>
    <PercentInput {...props} />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export default PercentField;
