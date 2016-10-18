import React from 'react';

import TextInput from '../forms/TextInput.jsx';
import TextInputNumber from '../forms/TextInputNumber.jsx';
import TextInputMoney from '../forms/TextInputMoney.jsx';
import RadioInput from '../forms/RadioInput.jsx';
import DropdownInput from '../forms/DropdownInput.jsx';
import ConditionalInput from '../forms/ConditionalInput.jsx';

export default class AutoForm extends React.Component {

  inputSwitch(singleInput, index) {
    switch (singleInput.type) {
      case 'TextInput':
        return (
          <TextInput
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            id={singleInput.id}
            key={index}
          />
        );
      case 'TextInputNumber':
        return (
          <TextInputNumber
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            id={singleInput.id}
            key={index}
          />
        );
      case 'TextInputMoney':
        return (
          <TextInputMoney
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            id={singleInput.id}
            key={index}
          />
        );
      case 'RadioInput':
        return (
          <RadioInput
            label={singleInput.label}
            values={singleInput.values}
            key={index}
          />
        );
      case 'DropdownInput':
        return (
          <DropdownInput
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            options={singleInput.options}
            key={index}
          />
        );
      case 'ConditionalInput':
        return (
          <ConditionalInput conditionalTrueValue={singleInput.conditionalTrueValue} key={index}>
            {this.inputSwitch(singleInput.inputs[0])}
            {this.inputSwitch(singleInput.inputs[1])}
          </ConditionalInput>
        );
      default:
        return '';
    }
  }

  render() {
    return (
      <form className={this.props.formClasses} onSubmit={this.props.onSubmit}>
        {this.props.inputs.map((input, index) => this.inputSwitch(input, index))}
        <button className="btn btn-primary" type="submit">Sauver</button>
      </form>
    );
  }
}

AutoForm.propTypes = {
  inputs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSubmit: React.PropTypes.func,
  formClasses: React.PropTypes.string,
};
