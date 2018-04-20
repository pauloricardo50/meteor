import React from 'react';
import PropTypes from 'prop-types';

import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const FormInput = ({
  input,
  meta: { touched, error },
  label,
  required,
  className,
  id,
  ...rest
}) => {
  const displayError = !!(touched && error);

  return (
    <FormControl
      error={displayError}
      required={required}
      className={className}
      id={id}
    >
      {label && <InputLabel shrink>{label}</InputLabel>}
      <Input {...input} {...rest} />
      {displayError && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

FormInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.any,
  }).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  required: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
};

FormInput.defaultProps = {
  label: undefined,
  required: false,
  className: '',
};

export default FormInput;
