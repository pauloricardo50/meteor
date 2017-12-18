import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import cleanMethod from 'core/api/cleanMethods';

import MyDateInput from '/imports/ui/components/general/DateInput';

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
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
    };
  }

  handleChange = (date) => {
    console.log('autoform changing', date);
    this.saveValue(date);
  };

  saveValue = (date) => {
    // Save data to DB
    const object = { [this.props.id]: date };

    cleanMethod(this.props.updateFunc, object, this.props.docId);
  };

  render() {
    const {
      style,
      label,
      currentValue,
      id,
      minDate,
      maxDate,
      disabled,
      openDirection,
    } = this.props;

    return (
      <div style={{ ...styles.div, ...style }} className="datepicker">
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
  label: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.object,
  maxDate: PropTypes.objectOf(PropTypes.any),
  minDate: PropTypes.objectOf(PropTypes.any),
  docId: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  updateFunc: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  openDirection: PropTypes.string,
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
