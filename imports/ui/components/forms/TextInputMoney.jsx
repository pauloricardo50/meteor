import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/loanrequests/methods.js';


import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '/imports/js/textMasks.js';
import { toNumber, toMoney } from '/imports/js/finance-math';

export default class TextInputMoney extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue ? String(this.props.currentValue).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'") : '',
    };

    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Only update if the value is new
    if (nextProps.currentValue !== this.state.value) {
      this.setState({ value: nextProps.currentValue });
    }
  }


  handleChange(event) {
    this.setState({
      value: event.target.value.replace(/\D/g, ''),
    });
  }

  handleBlur(event) {
    this.props.changeSaving(true);

    // Save data to DB
    const object = {};
    // Clean value and convert to Number
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
            this.handleChange(e);
            (typeof this.props.onChange === 'function') ? this.props.onChange : () => { return undefined; };
          }}
          onBlur={this.handleBlur}
          fullWidth
        >
          <MaskedInput
            mask={swissFrancMask}
            guide
            pattern="[0-9]*"
          />
        </TextField>
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
