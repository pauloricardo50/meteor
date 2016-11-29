import React, { Component, PropTypes } from 'react';


import TextInput from '../forms/TextInput.jsx';
import TextInputNumber from '../forms/TextInputNumber.jsx';
import TextInputMoney from '../forms/TextInputMoney.jsx';
import RadioInput from '../forms/RadioInput.jsx';
import DropdownInput from '../forms/DropdownInput.jsx';
import ConditionalInput from '../forms/ConditionalInput.jsx';


export default class AutoForm extends Component {

  inputSwitch(singleInput, index) {
    const extraValues = {
      requestId: this.props.creditRequest._id,
      changeSaving: this.props.changeSaving,
      changeErrors: this.props.changeErrors,
    };

    switch (singleInput.type) {
      case 'TextInput':
        return (
          <TextInput
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'TextInputNumber':
        return (
          <TextInputNumber
            {...singleInput}
            {...extraValues}
            key={index}
          />
        );
      case 'TextInputMoney':
        return (
          <TextInputMoney
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
      default:
        return '';
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
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  changeSaving: PropTypes.func,
  changeErrors: PropTypes.func,
};
