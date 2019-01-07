import BaseField from 'uniforms/BaseField';
import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';

import Button from '../Button';
import pick from 'lodash/pick';

const shouldDisableButton = ({
  disableActions,
  error,
  state: { submitting, validating, disabled },
  setDisableActions,
}) => {
  return disableActions === undefined
    ? !!(error || disabled || submitting || validating)
    : disableActions;
};

const CustomSubmitField = ({
  children,
  disableActions,
  inputRef,
  label,
  value,
  error,
  state,
  setDisableActions,
  ...props
}) => (
  <Button
    disabled={shouldDisableButton({
      disableActions,
      error,
      state,
      setDisableActions,
    })}
    ref={inputRef}
    type="submit"
    value={value}
    loading={state.submitting}
    {...filterDOMProps(props)}
  >
    {label || children}
  </Button>
);

CustomSubmitField.defaultProps = { label: 'Submit', variant: 'contained' };

export default CustomSubmitField;
