import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import cleanMethod from '/imports/api/cleanMethods';
import is from 'is_js';


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

export default class DateInput extends Component {
  constructor(props) {
    super(props);

    if (this.props.currentValue) {
      this.state = {
        value: moment(this.props.currentValue).toDate(), // TODO: verify this works in all timezones
        errorText: '',
      };
    } else {
      this.state = {
        value: undefined,
        errorText: '',
      };
    }

    this.setDateFormat();

    this.handleChange = this.handleChange.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }

  handleChange(event, date) {
    this.setState({
      value: date,
    }, this.saveValue);
  }

  saveValue() {
    // Remove time from date
    // TODO: verify this works in all timezones
    const dateWithoutTime = moment(this.state.value).format('YYYY-MM-DD');

    // Save data to DB
    const object = {};
    object[this.props.id] = dateWithoutTime;
    const id = this.props.requestId;

    cleanMethod('update', id, object);
  }

  setDateFormat() {
    this.DateTimeFormat = undefined;
    /**
     * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
     */
    if (areIntlLocalesSupported(['fr'])) {
      this.DateTimeFormat = global.Intl.DateTimeFormat;
    } else {
      const IntlPolyfill = require('intl');
      this.DateTimeFormat = IntlPolyfill.DateTimeFormat;
      require('intl/locale-data/jsonp/fr');
    }
  }

  render() {
    return (
      <div style={styles.div} className="datepicker">
        <label htmlFor={this.props.label} style={styles.label}>{this.props.label}</label>
        <DatePicker
          name={this.props.label}
          hintText="Choisir une date.."
          value={this.state.value}
          onChange={this.handleChange}
          id={this.props.id}
          errorText={this.state.errorText}
          maxDate={this.props.maxDate}
          textFieldStyle={styles.DatePickerField}
          locale="fr"
          DateTimeFormat={this.DateTimeFormat}
          cancelLabel="Annuler"
        />
      </div>
    );
  }
}

DateInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.string,
  requestId: PropTypes.string.isRequired,

  maxDate: PropTypes.objectOf(PropTypes.any),
};
