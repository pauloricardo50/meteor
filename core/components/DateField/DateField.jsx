// @flow
import React from 'react';
import moment from 'moment';

import TextField from '../AutoForm2/CustomTextField';

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
