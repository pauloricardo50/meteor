import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import MaskedInput from 'react-text-mask';

import { swissFrancMask, percentMask } from '../../utils/textMasks';
import FormInput from './FormInput';
import FormCheckbox from './FormCheckbox';
import { FIELD_TYPES } from './formConstants';
import { percentFormatters, moneyFormatters } from './formHelpers';

const FormField = ({ type, ...rest }) => {
  const defaultField = <Field component={FormInput} {...rest} />;

  switch (type) {
  case FIELD_TYPES.TEXT:
    return defaultField;
  case FIELD_TYPES.CHECKBOX:
    return <Field component={FormCheckbox} {...rest} />;
  case FIELD_TYPES.PERCENT:
    return (
      <Field
        component={FormInput}
        inputComponent={MaskedInput}
        inputProps={{ mask: percentMask }}
        {...percentFormatters}
        {...rest}
      />
    );
  case FIELD_TYPES.MONEY:
    return (
      <Field
        component={FormInput}
        inputComponent={MaskedInput}
        inputProps={{ mask: swissFrancMask }}
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
};

export default FormField;
