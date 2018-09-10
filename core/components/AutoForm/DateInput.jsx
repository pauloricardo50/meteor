import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';

import MyDateInput from 'core/components/DateInput';

import FormValidator from './FormValidator';

const styles = {
  div: {
    // display: 'block',
    // marginTop: 10,
    marginBottom: 8,
    position: 'relative',
  },
  DatePickerField: {
    width: '100%',
    // fontWeight: 'normal',
  },
  label: {
    fontSize: 12,
    marginBottom: 0,
    color: 'rgba(0, 0, 0, 0.298039)',
  },
};

class DateInput extends Component {
  handleChange = (date) => {
    if (date === undefined) {
      this.saveValue(null);
    } else {
      this.saveValue(date);
    }
  };

  saveValue = (date) => {
    // Save data to DB
    const object = { [this.props.inputProps.id]: date };

    this.props.updateFunc({ object, id: this.props.docId });
  };

  render() {
    const {
      inputProps: {
        style,
        label,
        currentValue,
        id,
        minDate,
        maxDate,
        disabled,
        openDirection,
      },
    } = this.props;

    return (
      <div style={{ ...styles.div, ...style }}>
        <MyDateInput
          label={label}
          value={currentValue}
          onChange={this.handleChange}
          id={id}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          openDirection={openDirection}
        />
        <FormValidator {...this.props} />
      </div>
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
