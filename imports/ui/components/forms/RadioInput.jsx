import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { updateValues } from '/imports/api/loanrequests/methods.js';


import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';

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
    this.props.changeSaving(true);
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

    updateValues.call({
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
            />),
          )}
        </RadioButtonGroup>
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.state.modalIsOpen}
          onRequestClose={this.handleClose}
        >
          {this.props.content}
        </Dialog>
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
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
};
