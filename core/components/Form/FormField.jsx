import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { withProps } from 'recompose';
import MaskedInput from 'react-text-mask';

import { swissFrancMask, percentMask } from '../../utils/textMasks';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';
import RenderFieldArray from './RenderFieldArray';
import { FIELD_TYPES } from './formConstants';
import {
  percentFormatters,
  moneyFormatters,
  numberFormatters,
  phoneFormatters,
} from './formHelpers';
import { required as requiredFunc } from './validators';

const defaultField = props => <Field {...props} />;

const arrayField = props => (
  <FieldArray {...props} component={RenderFieldArray} />
);

const FormField = ({ fieldType, validate, defaultFieldProps, ...rest }) => {
  switch (fieldType) {
  case FIELD_TYPES.TEXT:
    return defaultField({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.CHECKBOX:
    return <Field component={FormCheckbox} validate={validate} {...rest} />;

  case FIELD_TYPES.PERCENT:
    return withProps({
      inputComponent: MaskedInput,
      inputProps: { mask: percentMask },
      ...percentFormatters,
    })(defaultField)({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.MONEY:
    return withProps({
      inputComponent: MaskedInput,
      inputProps: { mask: swissFrancMask },
      ...moneyFormatters,
    })(defaultField)({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.NUMBER:
    return withProps({
      ...numberFormatters,
    })(defaultField)({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.PHONE:
    return withProps({
      ...phoneFormatters,
    })(defaultField)({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.TEXT_AREA:
    return withProps({ multiline: true, rows: 3 })(defaultField)({
      ...rest,
      ...defaultFieldProps,
    });

  case FIELD_TYPES.ARRAY:
    return arrayField({ ...defaultFieldProps, ...rest });

  default:
    return defaultField;
  }
};

FormField.propTypes = {
  fieldType: PropTypes.string,
  required: PropTypes.bool,
  validate: PropTypes.array,
};

FormField.defaultProps = {
  fieldType: FIELD_TYPES.TEXT,
  required: undefined,
  validate: [],
};

export default withProps(({ required, validate = [] }) => {
  const validateFunc = required ? [...validate, requiredFunc] : validate;

  return {
    defaultFieldProps: {
      component: FormInput,
      validate: validateFunc,
      required,
    },
  };
})(FormField);
