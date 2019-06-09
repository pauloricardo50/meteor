import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TextInput from 'core/components/TextInput';
import Loadable from 'core/utils/loadable';
import { withStyles } from '@material-ui/core/styles';

const DatePicker = Loadable({
  loader: () => import('./DatePicker'),
});

// Make sure the underline shows
const styles = {
  underline: {
    '&:before': {
      zIndex: 1,
    },
  },
};

class DateInput extends Component {
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
      classes,
      ...otherProps
    } = this.props;
    const { focused } = this.state;

    return (
      <TextInput
        classes={classes}
        className="date-input"
        id={id}
        type="date"
        placeholder={undefined}
        inputComponent={DatePicker}
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
        {...otherProps}
      />
    );
  }
}

DateInput.propTypes = {
  id: PropTypes.string,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  openDirection: PropTypes.string,
  value: PropTypes.object,
};

DateInput.defaultProps = {
  value: undefined,
  id: undefined,
  minDate: undefined,
  maxDate: undefined,
  openDirection: undefined,
};

export default withStyles(styles)(DateInput);
