import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import omit from 'lodash/omit';

import SingleDatePicker from 'react-dates/lib/components/SingleDatePicker';
import isInclusivelyAfterDay from 'react-dates/lib/utils/isInclusivelyAfterDay';
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';
import { withStyles } from 'react-with-styles';

// Given a min and/or max date, it blocks unavailable dates
const setDateRange = (minDate = new Date(), maxDate = undefined) => day =>
  (minDate && !isInclusivelyAfterDay(day, moment(minDate))) ||
  (maxDate && isInclusivelyAfterDay(day, moment(maxDate)));

const DatePicker = ({ minDate, maxDate, ...props }) => {
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
};

DatePicker.propTypes = {
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

DatePicker.defaultProps = {
  minDate: undefined,
  maxDate: undefined,
};

export default withStyles(() => ({
  ...DefaultTheme,
  color: {
    ...DefaultTheme.color,
    highlighted: {
      backgroundColor: '#4990e2',
      backgroundColor_active: '#4990e2',
      backgroundColor_hover: '#4990e2',
      color: 'white',
      color_active: 'white',
      color_hover: 'white',
    },
  },
}))(DatePicker);
