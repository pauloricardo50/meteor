import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import cleanMethod from '/imports/api/cleanMethods';

import DatePicker from 'material-ui/DatePicker';
import { injectIntl } from 'react-intl';

import { T } from '/imports/ui/components/general/Translation.jsx';
import FormValidator from './FormValidator.jsx';

const styles = {
  div: {
    display: 'block',
    marginTop: 10,
    marginBottom: 0,
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

  handleChange = (event, date) => {
    this.saveValue(date);
  };

  saveValue = (date) => {
    // Remove time from date
    // TODO: verify this works in all timezones
    const dateWithoutTime = moment(date).format('YYYY-MM-DD');

    // Save data to DB
    const object = {};
    object[this.props.id] = dateWithoutTime;

    cleanMethod(this.props.updateFunc, object, this.props.documentId);
  };

  render() {
    const formatDate = this.props.intl.formatDate;
    return (
      <div
        style={{ ...styles.div, ...this.props.style }}
        className="datepicker"
      >
        <label htmlFor={this.props.label} style={styles.label}>
          {this.props.label}
        </label>
        <DatePicker
          name={this.props.label}
          hintText={<T id="DateInput.placeholder" />}
          value={this.props.currentValue}
          onChange={this.handleChange}
          id={this.props.id}
          errorText={this.state.errorText}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          textFieldStyle={styles.DatePickerField}
          formatDate={date =>
            formatDate(date, {
              month: 'long',
              year: 'numeric',
              weekday: 'long',
              day: '2-digit',
            })}
          cancelLabel={<T id="general.cancel" />}
          disabled={this.props.disabled}
        />
        <FormValidator {...this.props} />
      </div>
    );
  }
}

DateInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.object,
  maxDate: PropTypes.objectOf(PropTypes.any),
  minDate: PropTypes.objectOf(PropTypes.any),
  documentId: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  updateFunc: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

DateInput.defaultProps = {
  maxDate: undefined,
  minDate: undefined,
  currentValue: undefined,
  style: {},
};

export default injectIntl(DateInput);
