import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import Button from '../Button';
import { T } from '../Translation';
import FormField from './FormField';
import { required as requiredFunc } from '.';

// Simply pass a "onSubmit" to this component, handleSubmit will be
// generated automatically by redux-form
// If submitting is async, make sure the onSubmit func returns a promise
const Form = ({
  handleSubmit,
  submitting,
  error,
  formArray,
  showButton,
  renderActions,
  FormWrapper,
}) => (
  <div>
    <FormWrapper>
      <form onSubmit={handleSubmit} className="form">
        {error && <span className="error">{error}</span>}

        {formArray.map(({ id, validate = [], required, ...otherProps }) => (
          <FormField
            key={id}
            name={id}
            validate={required ? [...validate, requiredFunc] : validate}
            required={required}
            {...otherProps}
          />
        ))}

        <Button
          type="submit"
          disabled={submitting}
          // Hide the button, so the form still submits on enter
          style={{ display: showButton ? 'initial' : 'none' }}
        >
          <T id="general.ok" />
        </Button>
      </form>
    </FormWrapper>

    {renderActions && renderActions({ handleSubmit, submitting })}
  </div>
);

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  formArray: PropTypes.array.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
  showButton: PropTypes.bool,
  onSubmitSuccess: PropTypes.func.isRequired,
  renderActions: PropTypes.func,
  FormWrapper: PropTypes.any,
  error: PropTypes.string,
};

Form.defaultProps = {
  initialValues: undefined,
  showButton: true,
  renderActions: undefined,
  FormWrapper: React.Fragment,
  error: undefined,
};

export default reduxForm()(Form);
