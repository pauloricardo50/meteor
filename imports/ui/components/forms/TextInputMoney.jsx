import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';


import TextField from 'material-ui/TextField';

export default class TextInputMoney extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: this.props.currentValue ? String(this.props.currentValue).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'") : '',
    };

    this.formatToMoney = this.formatToMoney.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

// Prevents people from entering characters other than numbers, and formats value with apostrophes
  formatToMoney(e) {
    this.setState({
      textValue: e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'"),
    });
  }

  handleBlur(event) {
    this.props.changeSaving(true);

    // Save data to DB
    const object = {};
    // Clean value and convert to Number
    object[this.props.id] = Number(event.target.value.replace(/\D/g, ''));

    CreditRequests.update(this.props.requestId, {
      $set: object,
    }, (error, result) => {
      this.props.changeSaving(false);

      if (error) {
        this.props.changeErrors(error.message);
        throw new Meteor.Error(500, error.message);
      } else {
        this.props.changeErrors('');
        return 'Update Successful';
      }
    });
  }

  render() {
    return (
      <div className="form-group">
        <TextField
          floatingLabelText={this.props.label}
          hintText={this.props.placeholder}
          value={this.state.textValue}
          type="text"
          id={this.props.id}
          onChange={(e) => {
            this.formatToMoney(e);
            (typeof this.props.onChange === 'function') ? this.props.onChange : () => { return undefined; };
          }}
          onBlur={this.handleBlur}
          fullWidth
        />
      </div>
    );
  }
}

TextInputMoney.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  requestId: PropTypes.string.isRequired,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
};
