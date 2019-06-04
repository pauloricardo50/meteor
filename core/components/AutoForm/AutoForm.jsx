import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cx from 'classnames';

import T from 'core/components/Translation';
import ZipAutoComplete from 'core/components/ZipAutoComplete';

import AutoFormTextInput from './AutoFormTextInput';
import AutoFormRadioInput from './AutoFormRadioInput';
import AutoFormSelectFieldInput from './AutoFormSelectFieldInput';
import AutoFormConditionalInput from './AutoFormConditionalInput';
import AutoFormDateInput from './AutoFormDateInput';
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
    className = '',
  } = childProps.inputProps;

  switch (type) {
  case 'textInput':
    return <AutoFormTextInput multiline={false} {...childProps} />;
  case 'radioInput':
    return <AutoFormRadioInput {...childProps} />;
  case 'selectFieldInput':
    return <AutoFormSelectFieldInput {...childProps} />;
  case 'conditionalInput':
    return (
      <AutoFormConditionalInput
        conditionalTrueValue={conditionalTrueValue}
        key={index}
        style={style}
        doc={parentProps.doc}
      >
        {makeMapInputs(parentProps)(inputs[0], 0)}
        {inputs.slice(1).map(makeMapInputs(parentProps))}
      </AutoFormConditionalInput>
    );
  case 'h3':
    return (
      <h3 className={className} style={styles.subtitle} key={index}>
        {label}
      </h3>
    );
  case 'h2':
    return (
      <h2 className={className} style={styles.subtitle} key={index}>
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
    return <AutoFormDateInput {...childProps} />;
  case 'arrayInput':
    return <ArrayInput {...childProps} />;
  case 'custom':
    if (component === 'ZipAutoComplete') {
      return <ZipAutoComplete {...childProps} {...componentProps} />;
    }
    return component;
  default:
    throw new Error(`${type} is not a valid AutoForm type`);
  }
};

const makeMapInputs = parentProps => (singleInput, index) => {
  const childProps = {
    ...parentProps,
    key: index, // Some inputs don't have id's, this means rendering a different form requires a re-render (or key prop on the form)
    inputProps: {
      ...singleInput,
      placeholder:
        singleInput.placeholder
        || `Forms.${singleInput.intlId || singleInput.id}.placeholder`,
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
    childProps.inputProps.label = (
      <span>
        <T
          id={`Forms.${childProps.inputProps.intlId
            || childProps.inputProps.id}`}
          values={childProps.inputProps.intlValues}
        />
        <span style={{ color: 'red' }}> *</span>
      </span>
    );
  } else {
    childProps.inputProps.label = (
      <T
        id={`Forms.${childProps.inputProps.intlId || childProps.inputProps.id}`}
        values={childProps.inputProps.intlValues}
      />
    );
  }

  // Support options that are only string/boolean ids instead of objects
  // check for undefined because of boolean false ids
  if (
    childProps.inputProps.type === 'radioInput'
    || childProps.inputProps.type === 'selectFieldInput'
  ) {
    childProps.inputProps.options = childProps.inputProps.options.map(o =>
      (o.id === undefined ? { id: o } : o));
  }

  // if info is true, map it to a i18n string
  if (childProps.inputProps.info) {
    childProps.inputProps.info = (
      <T
        id={`Forms.${childProps.inputProps.intlId
          || childProps.inputProps.id}.info`}
      />
    );
  }

  return inputSwitch(childProps, index, parentProps);
};

const AutoForm = ({
  formClasses,
  className,
  showDisclaimer,
  children,
  ...props
}) => (
  <form
    className={cx(formClasses, className)}
    onSubmit={e => e.preventDefault()}
  >
    {props.inputs.map(makeMapInputs(props))}
    {children}
    {showDisclaimer && (
      <p className="text-center">
        <T id="AutoForm.autosaveDisclaimer" />
      </p>
    )}
  </form>
);

AutoForm.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object),
  collection: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  docId: PropTypes.string.isRequired,
  formClasses: PropTypes.string,
  fullWidth: PropTypes.bool,
  inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  loan: PropTypes.objectOf(PropTypes.any),
  noPlaceholders: PropTypes.bool,
  showDisclaimer: PropTypes.bool,
};

AutoForm.defaultProps = {
  loan: {},
  borrowers: [],
  fullWidth: false,
  disabled: false,
  noPlaceholders: false,
  showDisclaimer: true,
};

export default AutoFormContainer(AutoForm);
