import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/loanrequests/methods.js';

import TextField from 'material-ui/TextField';


export default class TextInputNumber extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue ? this.props.currentValue : '',
    };

    this.formatToNumber = this.formatToNumber.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Only update if the value is new
    if (nextProps.currentValue !== this.state.value) {
      this.setState({ value: nextProps.currentValue });
    }
  }

// Prevents people from entering characters other than numbers, and formats value with apostrophes
  formatToNumber(e) {
    this.setState({
      value: e.target.value.replace(/\D/g, ''),
    });
  }

  handleBlur(event) {
    this.props.changeSaving(true);

    // Save data to DB
    const object = {};
    object[this.props.id] = Number(event.target.value.replace(/\D/g, ''));
    const id = this.props.requestId;

    updateValues.call({
      object, id,
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
          value={this.state.value}
          type="text"
          id={this.props.id}
          onChange={(e) => {
            this.formatToNumber(e);
            (typeof this.props.onChange === 'function') ? this.props.onChange : () => { return undefined; };
          }}
          onBlur={this.handleBlur}
          fullWidth
          pattern="[0-9]*"
        />
      </div>
    );
  }
}

TextInputNumber.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  currentValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  requestId: PropTypes.string,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
};
