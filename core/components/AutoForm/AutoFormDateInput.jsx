import PropTypes from 'prop-types';
import React, { Component } from 'react';

import AutoFormTextInput from './AutoFormTextInput';
import DatePicker from '../DateInput/DatePicker';

class DateInput extends Component {
  constructor() {
    super();
    this.state = { focused: false };
  }

  render() {
    const { inputProps } = this.props;
    const { focused } = this.state;

    return (
      <AutoFormTextInput
        {...this.props}
        showValidIconOnChange
        savingIconStyle={{ top: 10 }}
        inputProps={{
          ...inputProps,
          date: true,
          inputType: 'date',
          inputComponent: DatePicker,
          // onDateChange: date => onChange(date ? date.toDate() : undefined, id),
          onFocusChange: ({ focused: nextFocused }) =>
            this.setState({ focused: nextFocused }),
          focused,
        }}
      />
    );
  }
}

DateInput.propTypes = {
  currentValue: PropTypes.object,
  disabled: PropTypes.bool,
  docId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  maxDate: PropTypes.objectOf(PropTypes.any),
  minDate: PropTypes.objectOf(PropTypes.any),
  openDirection: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  updateFunc: PropTypes.string.isRequired,
};

DateInput.defaultProps = {
  maxDate: undefined,
  minDate: undefined,
  currentValue: undefined,
  style: {},
  disabled: false,
  openDirection: undefined,
};

export default DateInput;
