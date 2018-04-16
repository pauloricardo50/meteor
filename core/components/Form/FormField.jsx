import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import MaskedInput from 'react-text-mask';

import { swissFrancMask, percentMask } from '../../utils/textMasks';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';
import { FIELD_TYPES } from './formConstants';
import {
  percentFormatters,
  moneyFormatters,
  required as requiredFunc,
} from './formHelpers';

const FormField = ({ type, required, validate, ...rest }) => {
  const validateFunc = required ? [...validate, requiredFunc] : validate;
  const defaultFieldProps = {
    component: FormInput,
    validate: validateFunc,
    required,
  };
  const defaultField = <Field {...defaultFieldProps} {...rest} />;

  switch (type) {
  case FIELD_TYPES.TEXT:
    return defaultField;
  case FIELD_TYPES.CHECKBOX:
    return <Field component={FormCheckbox} validate={validate} {...rest} />;
  case FIELD_TYPES.PERCENT:
    return (
      <Field
        inputComponent={MaskedInput}
        inputProps={{ mask: percentMask }}
        {...defaultFieldProps}
        {...percentFormatters}
        {...rest}
      />
    );
  case FIELD_TYPES.MONEY:
    return (
      <Field
        inputComponent={MaskedInput}
        inputProps={{ mask: swissFrancMask }}
        {...defaultFieldProps}
        {...moneyFormatters}
        {...rest}
      />
    );
  default:
    return defaultField;
  }
};

FormField.propTypes = {
  type: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.array,
};

FormField.defaultProps = {
  type: FIELD_TYPES.TEXT,
  required: undefined,
  validate: [],
};

export default FormField;
