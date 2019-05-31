// @flow
import React from 'react';
import moment from 'moment';

import TextField from 'uniforms-material/TextField';

type DateFieldProps = {};

const DateField = (props: DateFieldProps) => (
  <TextField
    {...props}
    value={props.value && moment(props.value).format('YYYY-MM-DD')}
    type="date"
    InputLabelProps={{ shrink: true }}
  />
);
export default DateField;
