import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

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
            currentValue={singleInput.currentValue}
            key={index}
          />
        );
      case 'TextInputNumber':
        return (
          <TextInputNumber
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            id={singleInput.id}
            currentValue={singleInput.currentValue}
            key={index}
          />
        );
      case 'TextInputMoney':
        return (
          <TextInputMoney
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            id={singleInput.id}
            currentValue={singleInput.currentValue}
            key={index}
          />
        );
      case 'RadioInput':
        return (
          <RadioInput
            label={singleInput.label}
            values={singleInput.values}
            default={singleInput.default}
            currentValue={singleInput.currentValue}
            key={index}
          />
        );
      case 'DropdownInput':
        return (
          <DropdownInput
            label={singleInput.label}
            placeholder={singleInput.placeholder}
            options={singleInput.options}
            currentValue={singleInput.currentValue}
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
      <form className={this.props.formClasses} onSubmit={this.props.onSubmit}>
        {this.props.inputs.map((input, index1) => this.inputSwitch(input, index1))}
        <div className="form-group">
          <RaisedButton label="Sauver" primary />
        </div>
      </form>
    );
  }
}

AutoForm.propTypes = {
  inputs: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSubmit: React.PropTypes.func,
  formClasses: React.PropTypes.string,
};
