import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TextInput from '../TextInput';

import Loadable from 'core/utils/loadable';

// const SingleDatePicker = Loadable({
//   loader: () => import('react-dates/lib/components/SingleDatePicker'),
// });
const DatePicker = Loadable({
  loader: () => import('./DatePicker'),
});
// import DatePicker from './DatePicker';

export default class DateInput extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false };
  }

  render() {
    const {
      value,
      onChange,
      id,
      minDate,
      maxDate,
      openDirection,
      datePickerProps,
      ...otherProps
    } = this.props;
    const { focused } = this.state;

    return (
      <TextInput
        className="date-input"
        {...otherProps}
        id={id}
        inputComponent={DatePicker}
        type="date"
        placeholder={undefined}
        inputProps={{
          id,
          focused,
          minDate,
          maxDate,
          openDirection,
          // Check if date exists to allow for empty state
          date: value ? moment(value) : undefined,
          onDateChange: date => onChange(date ? date.toDate() : undefined, id),
          onFocusChange: ({ focused: nextFocused }) =>
            this.setState({ focused: nextFocused }),
          ...datePickerProps,
        }}
      />
    );
  }
}

DateInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  openDirection: PropTypes.string,
};

DateInput.defaultProps = {
  value: undefined,
  id: undefined,
  minDate: undefined,
  maxDate: undefined,
  openDirection: undefined,
};
