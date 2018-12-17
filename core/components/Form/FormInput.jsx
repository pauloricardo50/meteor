import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

const FormInput = ({
  input,
  meta: { touched, error },
  label,
  required,
  className,
  id,
  helperText,
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
      {!displayError && helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

FormInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.any,
  }).isRequired,
  required: PropTypes.bool,
};

FormInput.defaultProps = {
  label: undefined,
  required: false,
  className: '',
};

export default FormInput;
