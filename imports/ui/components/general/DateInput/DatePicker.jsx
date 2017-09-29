import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import isInclusivelyAfterDay from 'react-dates/lib/utils/isInclusivelyAfterDay';

// Given a min and/or max date, it blocks unavailable dates
const setDateRange = (minDate = new Date(), maxDate = undefined) => day =>
  (minDate && !isInclusivelyAfterDay(day, moment(minDate))) ||
  (maxDate && isInclusivelyAfterDay(day, moment(maxDate)));

const DatePicker = ({ minDate, maxDate, ...otherProps }) => (
  <SingleDatePicker
    {...otherProps}
    numberOfMonths={1}
    hideKeyboardShortcutsPanel
    showClearDate
    showDefaultInputIcon
    placeholder="Choisissez"
    firstDayOfWeek={1}
    enableOutsideDays
    isOutsideRange={
      minDate || maxDate ? setDateRange(minDate, maxDate) : undefined
    }
    displayFormat="D MMMM YYYY"
  />
);

DatePicker.propTypes = {
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

DatePicker.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
};

export default DatePicker;
