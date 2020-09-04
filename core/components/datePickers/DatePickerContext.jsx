import React from 'react';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const DatePickerContext = ({ children }) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    {children}
  </MuiPickersUtilsProvider>
);

export default DatePickerContext;
