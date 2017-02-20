import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';


import TextInput from '../forms/TextInput.jsx';
import RadioInput from '../forms/RadioInput.jsx';
import SelectFieldInput from '../forms/SelectFieldInput.jsx';
import ConditionalInput from '../forms/ConditionalInput.jsx';
import DateInput from '../forms/DateInput.jsx';
import DropzoneInput from '../forms/DropzoneInput.jsx';
import DropzoneArray from '../general/DropzoneArray.jsx';


const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 40,
  },
  smallWidth: {
    width: '100%',
    maxWidth: 400,
  },
  mediumWidth: {
    width: '100%',
    maxWidth: 600,
  },
  fullWidth: {
    width: '100%',
  },
};


export default class AutoForm extends Component {
  inputSwitch(singleInput, index) {
    const extraValues = {
      requestId: this.props.loanRequest._id,
      key: index,
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
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          />
        );
      case 'TextInputLarge':
        return (
          <TextInput
            multiLine
            {...singleInput}
            {...extraValues}
            style={styles.mediumWidth}
          />
        );
      case 'TextInputNumber':
        return (
          <TextInput
            number
            {...singleInput}
            {...extraValues}
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          />
        );
      case 'TextInputMoney':
        return (
          <TextInput
            money
            {...singleInput}
            {...extraValues}
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          />
        );
      case 'RadioInput':
        return (
          <RadioInput
            {...singleInput}
            {...extraValues}
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          />
        );
      case 'SelectFieldInput':
        return (
          <SelectFieldInput
            {...singleInput}
            {...extraValues}
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          />
        );
      case 'ConditionalInput':
        return (
          <ConditionalInput
            conditionalTrueValue={singleInput.conditionalTrueValue}
            key={index}
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          >
            {this.inputSwitch(singleInput.inputs[0])}
            {singleInput.inputs.slice(1).map((input, index2) => this.inputSwitch(input, index2))}
          </ConditionalInput>
        );
      case 'h3':
        return (
          <h3 style={styles.subtitle} key={index}>{singleInput.text}</h3>
        );
      case 'h2':
        return (
          <h2 style={styles.subtitle} key={index}>{singleInput.text}</h2>
        );
      case 'Space':
        return (
          <div style={{ width: '100%', height: singleInput.height }} key={index}>{singleInput.text}</div>
        );
      case 'DateInput':
        return (
          <DateInput
            {...singleInput}
            {...extraValues}
            key={index}
            style={this.props.fullWidth ? styles.fullWidth : styles.smallWidth}
          />
        );
      case 'DropzoneInput':
        return (
          // <DropzoneInput
          //   {...singleInput}
          //   {...extraValues}
          //   key={index}
          // />
          <DropzoneArray
            {...singleInput}
            {...extraValues}
            key={index}
            style={this.props.fullWidth ? styles.fullWidth : styles.mediumWidth}
          />
        );
      default:
        throw new Error('Not a valid AutoForm type');
    }
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className={this.props.formClasses}>
        <form style={styles.form} onSubmit={this.handleSubmit}>
          {this.props.inputs.map((input, index1) => this.inputSwitch(input, index1))}
        </form>
      </div>
    );
  }
}

AutoForm.defaultProps = {
  formClasses: '',
  fullWidth: false,
};

AutoForm.propTypes = {
  inputs: PropTypes.arrayOf(React.PropTypes.object).isRequired,
  formClasses: PropTypes.string,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  fullWidth: PropTypes.bool,
};
