import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';


import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const styles = {
  RadioButtonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  RadioButton: {
    // Required or else the buttons disappear behind the background color..
    // File an issue with material-ui?
    zIndex: 0,
    width: 'auto',
    paddingLeft: '20',
  },
  RadioButtonLabel: {
    whiteSpace: 'nowrap',
  },
  div: {
    marginTop: 10,
    marginBottom: 0,
  },
};

export default class RadioInput extends Component {
  constructor(props) {
    super(props);
    // Set initial state to be the 1st option
    if (this.props.currentValue !== undefined) {
      this.state = { value: this.props.currentValue };
    } else {
      this.state = { value: this.props.values[0] };
    }

    this.setValue = this.setValue.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }


  setValue(event) {
    // Change radio button group state to appropriate value
    this.setState({
      value: event.target.value,
    }, this.saveValue(event.target.value));
  }

  saveValue(value) {
    // For radiobuttons, check if I actually want to pass a boolean instead of a String
    // event.target.value is always a String
    let safeValue = value;
    if (value === 'true') {
      safeValue = true;
    } else if (value === 'false') {
      safeValue = false;
    }

    // Save data to DB
    const object = {};
    object[this.props.id] = safeValue;
    const id = this.props.requestId;

    cleanMethod('update', id, object);
  }


  render() {
    return (
      <div style={styles.div}>
        <label htmlFor={this.props.label}>{this.props.label}</label>
        <RadioButtonGroup
          name={this.props.label}
          defaultSelected={this.state.value}
          onChange={this.props.onConditionalChange}
          style={styles.RadioButtonGroup}
        >
          {this.props.values.map((value, index) =>
            (<RadioButton
              label={this.props.radioLabels[index]}
              value={value}
              onClick={this.setValue}
              key={index}
              style={styles.RadioButton}
              labelStyle={styles.RadioButtonLabel}
            />),
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
  ]),
};
