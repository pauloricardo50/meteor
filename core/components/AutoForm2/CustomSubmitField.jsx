import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';
import PropTypes from 'prop-types';

import Button from '../Button';
import T from '../Translation';

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
    primary = true,
    raised = true,
    secondary,
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
    primary={!secondary && primary}
    raised={raised}
    secondary={secondary}
    label={label || <T id="general.ok" />}
    onClick={e => {
      // Make sure the target type is event, even if the label of the button
      // was clicked. This is useful in PropertyForm and DashboardRecapProperty
      e.target.type = 'submit';
    }}
    {...filterDOMProps(props)}
  >
    {children}
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

CustomSubmitField.defaultProps = { variant: 'contained' };

export default CustomSubmitField;
