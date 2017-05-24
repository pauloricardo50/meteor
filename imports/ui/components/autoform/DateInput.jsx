import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import cleanMethod from '/imports/api/cleanMethods';

import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';

const styles = {
  div: {
    display: 'block',
    marginTop: 10,
    marginBottom: 0,
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

const getDateFormat = () => {
  /**
   * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
   */
  if (areIntlLocalesSupported(['fr'])) {
    return global.Intl.DateTimeFormat;
  }

  const IntlPolyfill = require('intl');
  return IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/fr');
};

export default class DateInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
    };
  }

  handleChange = (event, date) => {
    this.saveValue(date);
  };

  saveValue = date => {
    // Remove time from date
    // TODO: verify this works in all timezones
    const dateWithoutTime = moment(date).format('YYYY-MM-DD');

    // Save data to DB
    const object = {};
    object[this.props.id] = dateWithoutTime;

    cleanMethod(this.props.updateFunc, object, this.props.documentId);
  };

  render() {
    return (
      <div style={{ ...styles.div, ...this.props.style }} className="datepicker">
        <label htmlFor={this.props.label} style={styles.label}>
          {this.props.label}
        </label>
        <DatePicker
          name={this.props.label}
          hintText="Choisissez une date"
          value={this.props.currentValue}
          onChange={this.handleChange}
          id={this.props.id}
          errorText={this.state.errorText}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          textFieldStyle={styles.DatePickerField}
          locale="fr"
          DateTimeFormat={getDateFormat()}
          cancelLabel="Annuler"
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

DateInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.string,
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
  currentValue: '',
  style: {},
};
