import BaseField from 'uniforms/BaseField';
import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';

import Button from '../Button';

const CustomSubmitField = (
  { children, disabled, inputRef, label, value, ...props },
  { uniforms: { error, state } },
) => (
  <Button
    disabled={disabled === undefined ? !!(error || state.disabled) : disabled}
    ref={inputRef}
    type="submit"
    value={value}
    {...filterDOMProps(props)}
  >
    {label || children}
  </Button>
);
CustomSubmitField.contextTypes = BaseField.contextTypes;

CustomSubmitField.defaultProps = { label: 'Submit', variant: 'contained' };

export default CustomSubmitField;
