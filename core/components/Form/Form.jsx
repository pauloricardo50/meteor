import React from 'react';
import PropTypes from 'prop-types';

import FormContainer from './FormContainer';
import FormField from './FormField';
import FormSubmitButton from './FormSubmitButton';

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
  className,
  submitButtonProps,
}) => (
  <div className={className}>
    <FormWrapper>
      <form onSubmit={handleSubmit} className="form">
        {error && <span className="error">{error}</span>}
        {formArray.map(({ id, ...otherProps }) => (
          <FormField
            key={id}
            name={id}
            id={id}
            className="form-field"
            {...otherProps}
          />
        ))}
        <FormSubmitButton
          submitting={submitting}
          showButton={showButton}
          {...submitButtonProps}
        />
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
  onSubmitSuccess: PropTypes.func,
  renderActions: PropTypes.func,
  FormWrapper: PropTypes.any,
  error: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  submitButtonProps: PropTypes.object,
};

Form.defaultProps = {
  initialValues: undefined,
  showButton: true,
  onSubmitSuccess: null,
  renderActions: undefined,
  FormWrapper: React.Fragment,
  error: undefined,
  className: '',
  children: null,
  submitButtonProps: {},
};

export default FormContainer(Form);
