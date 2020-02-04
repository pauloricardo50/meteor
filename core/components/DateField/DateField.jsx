//      
import React from 'react';
import moment from 'moment';

import TextField from '../AutoForm2/CustomTextField';

                         

const DateField = (props                ) => (
  <TextField
    {...props}
    value={props.value && moment(props.value).format('YYYY-MM-DD')}
    type="date"
    InputLabelProps={{ shrink: true }}
  />
);
export default DateField;
