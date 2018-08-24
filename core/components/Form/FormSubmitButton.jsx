import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import T from '../Translation';

const FormSubmitButton = ({ submitting, showButton, ...otherProps }) => (
  <Button
    type="submit"
    disabled={submitting}
    // Hide the button, so the form still submits on enter
    style={{ display: showButton ? 'initial' : 'none' }}
    {...otherProps}
  >
    <T id="general.ok" />
  </Button>
);

FormSubmitButton.propTypes = {
  showButton: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default FormSubmitButton;
