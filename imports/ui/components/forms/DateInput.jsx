import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/creditrequests/methods.js';

import DatePicker from 'material-ui/DatePicker';


const styles = {
  div: {
    display: 'block',
    marginTop: 10,
    marginBottom: 0,
  },
};

export default class TextInput extends Component {
  constructor(props) {
    super(props);

    if (this.props.currentValue) {
      this.state = {
        value: this.props.currentValue,
        errorText: '',
      };
    } else {
      this.state = {
        value: this.props.maxDate,
        errorText: '',
      };
    }


    this.handleChange = this.handleChange.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }

  handleChange(event, date) {
    this.setState({
      value: date,
    });

    this.saveValue();
  }

  saveValue() {
    this.props.changeSaving(true);

    // Save data to DB
    const object = {};
    object[this.props.id] = this.state.value;
    const id = this.props.requestId;

    updateValues.call({
      object, id,
    }, (error, result) => {
      this.props.changeSaving(false);

      if (error) {
        this.props.changeErrors(error.message);
        this.setState({ errorText: error.message });
        throw new Meteor.Error(500, error.message);
      } else {
        this.props.changeErrors('');
        this.setState({ errorText: '' });
        return 'Update Successful';
      }
    });
  }

  render() {
    return (
      <div style={styles.div}>
        <label htmlFor={this.props.label}>{this.props.label}</label>
        <DatePicker
          name={this.props.label}
          hintText="Cliquez pour choisir une date"
          value={this.state.value}
          onChange={this.handleChange}
          id={this.props.id}
          errorText={this.state.errorText}
          maxDate={this.props.maxDate}
        />
      </div>
    );
  }
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  requestId: PropTypes.string.isRequired,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,

  maxDate: PropTypes.object,
};
