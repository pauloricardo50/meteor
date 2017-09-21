import PropTypes from 'prop-types';
import React from 'react';

import get from 'lodash/get';

import TextInput from './TextInput';
import RadioInput from './RadioInput';
import SelectFieldInput from './SelectFieldInput';
import ConditionalInput from './ConditionalInput';
import DateInput from './DateInput';
import UploaderArray from '../UploaderArray';
import ArrayInput from './ArrayInput';

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

const inputSwitch = (singleInput, index, parentProps) => {
  const props = {
    ...parentProps,
    ...singleInput,
    key: index, // Some inputs don't have id's, this means rendering a different form requires a re-render (or key prop on the form)
    style: parentProps.fullWidth ? styles.fullWidth : styles.smallWidth,
    currentValue: get(parentProps.doc, singleInput.id),
    disabled: parentProps.disabled || singleInput.disabled,
  };

  if (parentProps.noPlaceholders) {
    props.placeholder = '';
  }

  // Prevent undefined condition to trigger as well
  if (singleInput.condition === false) {
    return null;
  }

  if (singleInput.required !== false && typeof singleInput.label === 'string') {
    // Add a required star to every label, except if it isn't required
    props.label = `${singleInput.label} *`;
  }

  switch (singleInput.type) {
    case 'textInput':
      return <TextInput multiLine={false} {...props} />;
    case 'textInputLarge':
      return <TextInput multiLine {...props} style={styles.mediumWidth} />;
    case 'radioInput':
      return <RadioInput {...props} />;
    case 'selectFieldInput':
      return <SelectFieldInput {...props} />;
    case 'conditionalInput':
      return (
        <ConditionalInput
          conditionalTrueValue={singleInput.conditionalTrueValue}
          key={index}
          style={props.style}
        >
          {inputSwitch(singleInput.inputs[0], 0, parentProps)}
          {singleInput.inputs
            .slice(1)
            .map((input, i) => inputSwitch(input, i, parentProps))}
        </ConditionalInput>
      );
    case 'h3':
      return (
        <h3 style={styles.subtitle} key={index}>
          {singleInput.text}
        </h3>
      );
    case 'h2':
      return (
        <h2 style={styles.subtitle} key={index}>
          {singleInput.text}
        </h2>
      );
    case 'space':
      return (
        <div style={{ width: '100%', height: singleInput.height }} key={index}>
          {singleInput.text}
        </div>
      );
    case 'dateInput':
      return <DateInput {...props} />;
    case 'dropzoneInput':
      return <UploaderArray {...props} />;
    case 'arrayInput':
      return <ArrayInput {...props} />;
    case 'custom':
      return React.cloneElement(singleInput.component, { ...props });
    default:
      throw new Error(`${singleInput.type} is not a valid AutoForm type`);
  }
};

const AutoForm = props => (
  <div className={props.formClasses}>
    <form style={styles.form} onSubmit={e => e.preventDefault()}>
      {props.inputs.map((input, i) => inputSwitch(input, i, props))}
    </form>
  </div>
);

AutoForm.propTypes = {
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  formClasses: PropTypes.string,
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  fullWidth: PropTypes.bool,
  documentId: PropTypes.string.isRequired,
  updateFunc: PropTypes.string,
  pushFunc: PropTypes.string,
  popFunc: PropTypes.string,
  disabled: PropTypes.bool,
  noPlaceholders: PropTypes.bool,
};

AutoForm.defaultProps = {
  loanRequest: {},
  borrowers: [],
  fullWidth: false,
  updateFunc: 'updateRequest',
  pushFunc: 'pushRequestValue',
  popFunc: 'popRequestValue',
  disabled: false,
  noPlaceholders: false,
};

export default AutoForm;
