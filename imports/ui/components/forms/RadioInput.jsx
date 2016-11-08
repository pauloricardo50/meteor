import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateSingleValue } from '/imports/api/creditrequests/methods.js';


import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

export default class RadioInput extends React.Component {

  constructor(props) {
    super(props);
    // Set initial state to be the 2nd option
    this.state = { value: this.props.currentValue };

    this.setValue = this.setValue.bind(this);
  }

  setValue(event) {
    // Change radio button group state to appropriate value
    this.setState({
      value: event.target.value,
    });

    this.props.changeSaving(true);

    // Save data to DB
    const object = {};
    object[this.props.id] = event.target.value;
    const id = this.props.requestId;

    updateSingleValue.call({
      object, id,
    }, (error, result) => {
      if (error) {
        this.props.changeErrors(error.message);
        throw new Meteor.Error(500, error.message);
      } else {
        this.props.changeSaving(false);
        this.props.changeErrors('');
        return 'Update Successful';
      }
    });
  }


  render() {
    return (
      <div>
        <label htmlFor={this.props.label}>{this.props.label}</label>
        <RadioButtonGroup
          name={this.props.label}
          defaultSelected={this.props.currentValue}
          onChange={this.props.onConditionalChange}
        >
          {this.props.values.map((value, index) =>
            (<RadioButton
              label={this.props.radioLabels[index]}
              value={value}
              onClick={this.setValue}
              key={index}
            />)
          )}
        </RadioButtonGroup>
      </div>
    );
  }
}

RadioInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  radioLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.any).isRequired,
  onConditionalChange: PropTypes.func,
  requestId: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
};
