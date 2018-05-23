import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import TextInput from 'core/components/TextInput';
import Loadable from 'core/utils/loadable';
import { withStyles } from '@material-ui/core/styles';

const DatePicker = Loadable({
  loader: () => import('./DatePicker'),
});

const styles = theme => ({
  underline: {
    '&:before': {
      zIndex: 1,
      color: 'red',
    },
  },
});

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
        {...otherProps}
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

export default withStyles(styles)(DateInput);
