import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import TextInput from '../forms/TextInput.jsx';
import RadioInput from '../forms/RadioInput.jsx';
import DropdownInput from '../forms/DropdownInput.jsx';
import ConditionalInput from '../forms/ConditionalInput.jsx';
import DateInput from '../forms/DateInput.jsx';


const styles = {
  subtitle: {
    marginTop: 40,
  },
};


export default class AutoForm extends Component {

  inputSwitch(singleInput, index) {
    const extraValues = {
      requestId: this.props.loanRequest._id,
    };

    // Prevent undefined showCondition to trigger as well
    if (singleInput.showCondition === false) {
      return null;
    }

    switch (singleInput.type) {
      case 'TextInput':
        return (
          <TextInput
            multiLine={false}
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'TextInputLarge':
        return (
          <TextInput
            multiLine
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'TextInputNumber':
        return (
          <TextInput
            number
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'TextInputMoney':
        return (
          <TextInput
            money
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'RadioInput':
        return (
          <RadioInput
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'DropdownInput':
        return (
          <DropdownInput
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'ConditionalInput':
        return (
          <ConditionalInput conditionalTrueValue={singleInput.conditionalTrueValue} key={index}>
            {this.inputSwitch(singleInput.inputs[0])}
            {singleInput.inputs.slice(1).map((input, index2) => this.inputSwitch(input, index2))}
          </ConditionalInput>
        );
      case 'Subtitle':
        return (
          <h3 style={styles.subtitle} key={index}>{singleInput.text}</h3>
        );
      case 'DateInput':
        return (
          <DateInput
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      default:
        throw new Error('Not a valid AutoForm type');
    }
  }

  render() {
    return (
      <form className={this.props.formClasses}>
        {this.props.inputs.map((input, index1) => this.inputSwitch(input, index1))}
      </form>
    );
  }
}

AutoForm.propTypes = {
  inputs: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  formClasses: PropTypes.string,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
