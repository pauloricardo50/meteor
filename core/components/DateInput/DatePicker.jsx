import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import omit from 'lodash/omit';

import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import isInclusivelyAfterDay from 'react-dates/lib/utils/isInclusivelyAfterDay';

// Given a min and/or max date, it blocks unavailable dates
const setDateRange = (minDate = undefined, maxDate = undefined) => day =>
  (minDate && !isInclusivelyAfterDay(day, moment(minDate)))
  || (maxDate && isInclusivelyAfterDay(day, moment(maxDate)));

const returnYears = () => {
  const years = [];
  for (let i = moment().year() - 100; i <= moment().year(); i++) {
    years.push(<option value={i}>{i}</option>);
  }
  return years;
};

const renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
      <select
        value={month.month()}
        onChange={e => onMonthSelect(month, e.target.value)}
      >
        {moment.months().map((label, value) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
    <div>
      <select
        value={month.year()}
        onChange={e => onYearSelect(month, e.target.value)}
      >
        {returnYears()}
      </select>
    </div>
  </div>
);

const DatePicker = ({ minDate, maxDate, value, ...props }) => {
  // To prevent prop warnings
  const otherProps = omit(props, [
    'autoFocus',
    'autoComplete',
    'className',
    'onChange',
    'onKeyUp',
    'onKeyDown',
    'value',
    'name',
    'defaultValue',
    'type',
    'rows',
  ]);
  return (
    <SingleDatePicker
      {...otherProps}
      date={value}
      numberOfMonths={1}
      hideKeyboardShortcutsPanel
      showClearDate
      showDefaultInputIcon
      placeholder="Choisissez"
      firstDayOfWeek={1}
      enableOutsideDays
      isOutsideRange={
        minDate || maxDate ? setDateRange(minDate, maxDate) : () => false
      }
      displayFormat="D MMMM YYYY"
      renderMonthElement={renderMonthElement}
    />
  );
};

DatePicker.propTypes = {
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
};

DatePicker.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
};

export default DatePicker;
