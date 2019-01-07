import BaseField from 'uniforms/BaseField';
import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';
import PropTypes from 'prop-types';

import Button from '../Button';
import pick from 'lodash/pick';

const shouldDisableButton = ({
  disableActions,
  error,
  state: { submitting, validating, disabled },
}) => {
  return disableActions === undefined
    ? !!(error || disabled || submitting || validating)
    : disableActions;
};

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
