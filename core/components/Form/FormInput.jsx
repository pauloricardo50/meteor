import React from 'react';
import PropTypes from 'prop-types';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const FormInput = ({
  input,
  meta: { touched, error },
  label,
  required,
  ...rest
}) => {
  const displayError = !!(touched && error);
  console.log('rest props', rest);

  return (
    <FormControl error={displayError} required={required}>
      {label && <InputLabel>{label}</InputLabel>}
      <Input {...input} {...rest} />
      {displayError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

FormInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  required: PropTypes.bool,
};

FormInput.defaultProps = {
  label: undefined,
  required: false,
};

export default FormInput;
