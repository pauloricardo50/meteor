import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { KeyboardDatePicker } from '@material-ui/pickers';

import DatePickerContext from './DatePickerContext';

const DatePicker = ({
  value,
  onChange,
  label,
  margin,
  disabled,
  name,
  ...props
}) => (
  <DatePickerContext>
    <FormControl margin={margin ?? 'dense'}>
      <KeyboardDatePicker
        disableFuture
        openTo="year"
        format="d/MM/yyyy"
        label={label}
        views={['year', 'month', 'date']}
        value={value || null}
        onChange={newValue => {
          onChange(newValue ? newValue.toDate() : newValue);
        }}
        autoOk
        disabled={disabled}
        name={name}
      />
    </FormControl>
  </DatePickerContext>
);

export default DatePicker;
