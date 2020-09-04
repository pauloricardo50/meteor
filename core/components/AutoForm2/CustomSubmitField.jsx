import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { filterDOMProps } from 'uniforms';

import Button from '../Button';
import T from '../Translation';

// This lets the submit button keep loading forever in case you're expecting
// a UI transition and you just want the button to keep its loading state
const useForeverLoading = (keepLoading, state, error) => {
  const [foreverLoading, setForeverLoading] = useState(false);
  useEffect(() => {
    if (keepLoading) {
      if (!foreverLoading && state.submitting) {
        setForeverLoading(true);
      }

      if (foreverLoading && error) {
        setForeverLoading(false);
      }
    }
  }, [state.submitting, error]);

  return foreverLoading;
};

const shouldDisableButton = ({
  disableActions,
  error,
  state: { submitting, validating, disabled },
  foreverLoading,
}) =>
  !!(
    disableActions ||
    error ||
    disabled ||
    submitting ||
    validating ||
    foreverLoading
  );

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
    showSubmitField = true,
    keepLoading,
    ...props
  },
  { uniforms: { state, error } },
) => {
  const foreverLoading = useForeverLoading(keepLoading, state, error);

  if (!showSubmitField) {
    return null;
  }

  return (
    <Button
      disabled={shouldDisableButton({
        disableActions,
        error,
        state,
        setDisableActions,
        foreverLoading,
      })}
      ref={inputRef}
      type="submit"
      value={value}
      loading={state.submitting || foreverLoading}
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
};

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
