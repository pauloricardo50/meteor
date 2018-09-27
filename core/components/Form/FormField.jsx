import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { withProps } from 'recompose';
import MaskedInput from 'react-text-mask';
import InputAdornment from '@material-ui/core/InputAdornment';

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
import SelectField from './SelectField';

const field = props => <Field {...props} />;

const arrayField = props => (
  <FieldArray {...props} component={RenderFieldArray} />
);

const FormField = ({ fieldType, defaultFieldProps, ...rest }) => {
  switch (fieldType) {
  case FIELD_TYPES.TEXT:
    return field({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.CHECKBOX:
    return field({ ...defaultFieldProps, ...rest, component: FormCheckbox });

  case FIELD_TYPES.PERCENT:
    return field({
      inputComponent: MaskedInput,
      inputProps: { mask: percentMask },
      ...percentFormatters,
      ...defaultFieldProps,
      ...rest,
    });

  case FIELD_TYPES.MONEY:
    return field({
      inputComponent: MaskedInput,
      inputProps: { mask: swissFrancMask },
      startAdornment: <InputAdornment position="start">CHF</InputAdornment>,
      ...moneyFormatters,
      ...defaultFieldProps,
      ...rest,
    });

  case FIELD_TYPES.NUMBER:
    return field({ ...numberFormatters, ...defaultFieldProps, ...rest });

  case FIELD_TYPES.PHONE:
    return field({ ...phoneFormatters, ...defaultFieldProps, ...rest });

  case FIELD_TYPES.TEXT_AREA:
    return field({ ...rest, ...defaultFieldProps, multiline: true, rows: 3 });

  case FIELD_TYPES.ARRAY:
    return arrayField({ ...defaultFieldProps, ...rest });

  case FIELD_TYPES.SELECT: {
    return field({ ...defaultFieldProps, ...rest, component: SelectField });
  }

  default:
    return field;
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
