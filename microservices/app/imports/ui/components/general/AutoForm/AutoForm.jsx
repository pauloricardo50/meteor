import PropTypes from 'prop-types';
import React from 'react';

import get from 'lodash/get';

import { T } from 'core/components/Translation';
import ZipAutoComplete from '/imports/ui/components/general/ZipAutoComplete';

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

const inputSwitch = (childProps, index, parentProps) => {
  switch (childProps.type) {
    case 'textInput':
      return <TextInput multiline={false} {...childProps} />;
    case 'textInputLarge':
      return <TextInput multiline {...childProps} style={styles.mediumWidth} />;
    case 'radioInput':
      return <RadioInput {...childProps} />;
    case 'selectFieldInput':
      return <SelectFieldInput {...childProps} />;
    case 'conditionalInput':
      return (
        <ConditionalInput
          conditionalTrueValue={childProps.conditionalTrueValue}
          key={index}
          style={childProps.style}
          doc={parentProps.doc}
        >
          {mapInputs(childProps.inputs[0], 0, parentProps)}
          {childProps.inputs
            .slice(1)
            .map((input, i) => mapInputs(input, i, parentProps))}
        </ConditionalInput>
      );
    case 'h3':
      return (
        <h3 style={styles.subtitle} key={index}>
          {childProps.label}
        </h3>
      );
    case 'h2':
      return (
        <h2 style={styles.subtitle} key={index}>
          {childProps.label}
        </h2>
      );
    case 'space':
      return (
        <div style={{ width: '100%', height: childProps.height }} key={index}>
          {childProps.text}
        </div>
      );
    case 'dateInput':
      return <DateInput {...childProps} />;
    case 'dropzoneInput':
      return <UploaderArray {...childProps} />;
    case 'arrayInput':
      return <ArrayInput {...childProps} />;
    case 'custom':
      if (childProps.component === 'ZipAutoComplete') {
        return (
          <ZipAutoComplete {...childProps} {...childProps.componentProps} />
        );
      }
      return null;
    default:
      throw new Error(`${childProps.type} is not a valid AutoForm type`);
  }
};

const mapInputs = (singleInput, index, parentProps) => {
  const childProps = {
    ...parentProps,
    ...singleInput,
    key: index, // Some inputs don't have id's, this means rendering a different form requires a re-render (or key prop on the form)
    style: parentProps.fullWidth ? styles.fullWidth : styles.smallWidth,
    currentValue: get(parentProps.doc, singleInput.id),
    disabled: parentProps.disabled || singleInput.disabled,
    placeholder: `Forms.${singleInput.intlId || singleInput.id}.placeholder`,
  };

  if (parentProps.noPlaceholders) {
    childProps.placeholder = '';
  }

  // Prevent undefined condition to trigger as well
  if (childProps.condition === false) {
    return null;
  }

  // Add a required star to every label, except if it isn't required
  if (childProps.required !== false) {
    childProps.label = (
      <span>
        <T
          id={`Forms.${childProps.intlId || childProps.id}`}
          values={childProps.intlValues}
        />
        {' *'}
      </span>
    );
  } else {
    childProps.label = (
      <T
        id={`Forms.${childProps.intlId || childProps.id}`}
        values={childProps.intlValues}
      />
    );
  }

  // Support options that are only string/boolean ids instead of objects
  // check for undefined because of boolean false ids
  if (
    childProps.type === 'radioInput' ||
    childProps.type === 'selectFieldInput'
  ) {
    childProps.options = childProps.options.map(
      o => (o.id === undefined ? { id: o } : o),
    );
  }

  // if info is true, map it to a i18n string
  if (childProps.info) {
    childProps.info = (
      <T id={`Forms.${childProps.intlId || childProps.id}.info`} />
    );
  }

  return inputSwitch(childProps, index, parentProps);
};

const AutoForm = props => (
  <div className={props.formClasses}>
    <form style={styles.form} onSubmit={e => e.preventDefault()}>
      {props.inputs.map((input, i) => mapInputs(input, i, props))}
    </form>
  </div>
);

AutoForm.propTypes = {
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  formClasses: PropTypes.string,
  loanRequest: PropTypes.objectOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.object),
  fullWidth: PropTypes.bool,
  docId: PropTypes.string.isRequired,
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
