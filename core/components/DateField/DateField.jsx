// @flow
import React from 'react';
import TextField from 'uniforms-material/TextField';

type DateFieldProps = {};

const DateField = (props: DateFieldProps) => (
  <TextField {...props} type="date" InputLabelProps={{ shrink: true }} />
);

export default DateField;
