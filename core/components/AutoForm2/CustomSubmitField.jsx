import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';
import PropTypes from 'prop-types';

import Button from '../Button';

const shouldDisableButton = ({
  disableActions,
  error,
  state: { submitting, validating, disabled },
}) => !!(disableActions || error || disabled || submitting || validating);

const CustomSubmitField = (
  {
    children,
    disableActions,
    inputRef,
    label,
    value,
    setDisableActions,
    ...props
  },
  { uniforms: { state, error } },
) => (
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

CustomSubmitField.contextTypes = {
  uniforms: PropTypes.shape({
    error: PropTypes.any,
    state: PropTypes.shape({
      submitting: PropTypes.bool.isRequired,
      disabled: PropTypes.bool.isRequired,
      validating: PropTypes.bool.isRequired,
    }).isRequired,
  }),
};

CustomSubmitField.defaultProps = { label: 'Submit', variant: 'contained' };

export default CustomSubmitField;
