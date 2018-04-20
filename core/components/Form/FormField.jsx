import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withProps } from 'recompose';
import MaskedInput from 'react-text-mask';

import { swissFrancMask, percentMask } from '../../utils/textMasks';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';
import { FIELD_TYPES } from './formConstants';
import { percentFormatters, moneyFormatters } from './formHelpers';
import { required as requiredFunc } from './validators';

const FormField = ({ type, required, validate, ...rest }) => {
  const validateFunc = required ? [...validate, requiredFunc] : validate;
  const defaultFieldProps = {
    component: FormInput,
    validate: validateFunc,
    required,
  };

  const defaultField = props => (
    <Field {...defaultFieldProps} {...rest} {...props} />
  );

  switch (type) {
  case FIELD_TYPES.TEXT:
    return defaultField();
  case FIELD_TYPES.CHECKBOX:
    return <Field component={FormCheckbox} validate={validate} {...rest} />;
  case FIELD_TYPES.PERCENT:
    return withProps({
      inputComponent: MaskedInput,
      inputProps: { mask: percentMask },
      ...percentFormatters,
    })(defaultField)();

  case FIELD_TYPES.MONEY:
    return withProps({
      inputComponent: MaskedInput,
      inputProps: { mask: swissFrancMask },
      ...moneyFormatters,
    })(defaultField)();

  case FIELD_TYPES.TEXT_AREA:
    return withProps({ multiline: true, rows: 3 })(defaultField)();
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
