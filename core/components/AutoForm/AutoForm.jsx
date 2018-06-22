import PropTypes from 'prop-types';
import React from 'react';

import get from 'lodash/get';

import T from 'core/components/Translation';
import ZipAutoComplete from 'core/components/ZipAutoComplete';

import TextInput from './TextInput';
import RadioInput from './RadioInput';
import SelectFieldInput from './SelectFieldInput';
import ConditionalInput from './ConditionalInput';
import DateInput from './DateInput';
import ArrayInput from './ArrayInput';
import AutoFormContainer from './AutoFormContainer';

const styles = {
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

const inputSwitch = (childProps, index, parentProps) => {
  const {
    type,
    conditionalTrueValue,
    style,
    inputs,
    label,
    text,
    component,
    componentProps,
    height,
  } = childProps.inputProps;

  switch (type) {
  case 'textInput':
    return <TextInput multiline={false} {...childProps} />;
  case 'radioInput':
    return <RadioInput {...childProps} />;
  case 'selectFieldInput':
    return <SelectFieldInput {...childProps} />;
  case 'conditionalInput':
    return (
      <ConditionalInput
        conditionalTrueValue={conditionalTrueValue}
        key={index}
        style={style}
        doc={parentProps.doc}
      >
        {mapInputs(inputs[0], 0, parentProps)}
        {inputs.slice(1).map((input, i) => mapInputs(input, i, parentProps))}
      </ConditionalInput>
    );
  case 'h3':
    return (
      <h3 style={styles.subtitle} key={index}>
        {label}
      </h3>
    );
  case 'h2':
    return (
      <h2 style={styles.subtitle} key={index}>
        {label}
      </h2>
    );
  case 'space':
    return (
      <div style={{ width: '100%', height }} key={index}>
        {text}
      </div>
    );
  case 'dateInput':
    return <DateInput {...childProps} />;
  case 'arrayInput':
    return <ArrayInput {...childProps} />;
  case 'custom':
    if (component === 'ZipAutoComplete') {
      return <ZipAutoComplete {...childProps} {...componentProps} />;
    }
    return null;
  default:
    throw new Error(`${type} is not a valid AutoForm type`);
  }
};

const mapInputs = (singleInput, index, parentProps) => {
  const childProps = {
    ...parentProps,
    key: index, // Some inputs don't have id's, this means rendering a different form requires a re-render (or key prop on the form)
    inputProps: {
      ...singleInput,
      placeholder:
        singleInput.placeholder ||
        `Forms.${singleInput.intlId || singleInput.id}.placeholder`,
      disabled: parentProps.disabled || singleInput.disabled,
      currentValue: get(parentProps.doc, singleInput.id),
      style: parentProps.fullWidth ? styles.fullWidth : styles.smallWidth,
      required: singleInput.required !== false,
    },
  };

  if (parentProps.noPlaceholders) {
    childProps.inputProps.placeholder = '';
  }

  // Prevent undefined condition to trigger as well
  if (childProps.inputProps.condition === false) {
    return null;
  }

  if (childProps.inputProps.required === true) {
    childProps.inputProps.label =
      (<span>
        <T
          id={`Forms.${childProps.inputProps.intlId ||
            childProps.inputProps.id}`}
          values={childProps.inputProps.intlValues}
        />
        <span style={{ color: 'red' }}> *</span>
      </span>)
    ;
  } else {
    childProps.inputProps.label =
      (<T
        id={`Forms.${childProps.inputProps.intlId || childProps.inputProps.id}`}
        values={childProps.inputProps.intlValues}
      />)
    ;
  }

  // Support options that are only string/boolean ids instead of objects
  // check for undefined because of boolean false ids
  if (
    childProps.inputProps.type === 'radioInput' ||
    childProps.inputProps.type === 'selectFieldInput'
  ) {
    childProps.inputProps.options = childProps.inputProps.options.map(o => (o.id === undefined ? { id: o } : o), );
  }

  // if info is true, map it to a i18n string
  if (childProps.inputProps.info) {
    childProps.inputProps.info =
      (<T
        id={`Forms.${childProps.inputProps.intlId ||
          childProps.inputProps.id}.info`}
      />)
    ;
  }

  return inputSwitch(childProps, index, parentProps);
};

const AutoForm = props =>
  (<div className={props.formClasses} onSubmit={e => e.preventDefault()}>
    {props.inputs.map((input, i) => mapInputs(input, i, props))}
  </div>)
;

AutoForm.propTypes = {
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  formClasses: PropTypes.string,
  loan: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  fullWidth: PropTypes.bool,
  docId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  noPlaceholders: PropTypes.bool,
  collection: PropTypes.string.isRequired,
};

AutoForm.defaultProps = {
  loan: {},
  borrowers: [],
  fullWidth: false,
  disabled: false,
  noPlaceholders: false,
};

export default AutoFormContainer(AutoForm);
