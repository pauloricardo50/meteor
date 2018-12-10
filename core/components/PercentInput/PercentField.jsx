// @flow
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import PercentInput from './PercentInput';

type PercentFieldProps = {};

const PercentField = ({ label, required, ...props }: PercentFieldProps) => (
  <FormControl required={required} margin="normal">
    <InputLabel>{label}</InputLabel>
    <PercentInput {...props} />
  </FormControl>
);

export default PercentField;
