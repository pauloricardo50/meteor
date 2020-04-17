import React, { useState } from 'react';
import moment from 'moment';

import Loadable from '../../utils/loadable';
import { defaultDatePickerProps } from './dateInputConstants';

const DefaultDateRangePicker = Loadable({
  loader: () => import('react-dates/lib/components/DateRangePicker'),
});

const DateRangePicker = ({ range, onChange, ...rest }) => {
  const { startDate, endDate } = range;
  const [focusedInput, onFocusChange] = useState(null);

  return (
    <DefaultDateRangePicker
      {...defaultDatePickerProps}
      startDate={startDate && moment(startDate)}
      startDateId="your_unique_start_date_id"
      endDate={endDate && moment(endDate)}
      endDateId="your_unique_end_date_id"
      onDatesChange={newRange =>
        onChange({
          startDate: newRange.startDate && newRange.startDate.toDate(),
          endDate: newRange.endDate && newRange.endDate.toDate(),
        })
      }
      focusedInput={focusedInput}
      onFocusChange={onFocusChange}
      reopenPickerOnClearDates
      showClearDates
      enableOutsideDays
      isOutsideRange={() => false}
      {...rest}
    />
  );
};

export default DateRangePicker;
