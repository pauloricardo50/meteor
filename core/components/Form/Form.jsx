import React from 'react';
import PropTypes from 'prop-types';

import FormContainer from './FormContainer';
import FormField from './FormField';
import FormSubmitButton from './FormSubmitButton';

// Simply pass a "onSubmit" to this component, handleSubmit will be
// generated automatically by redux-form
// If submitting is async, make sure the onSubmit func returns a promise
const Form = (props) => {
  const {
    handleSubmit,
    submitting,
    error,
    formArray,
    showButton,
    renderActions,
    FormWrapper,
    className,
    submitButtonProps,
    onSubmit,
  } = props;
  console.log('form props', props);

  return (
    <div className={className}>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
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
        {error && <span className="error text-center">{error}</span>}
      </FormWrapper>

      {renderActions && renderActions({ handleSubmit, submitting })}
    </div>
  );
};

Form.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  error: PropTypes.string,
  form: PropTypes.string.isRequired,
  formArray: PropTypes.array.isRequired,
  FormWrapper: PropTypes.any,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onSubmitSuccess: PropTypes.func,
  renderActions: PropTypes.func,
  showButton: PropTypes.bool,
  submitButtonProps: PropTypes.object,
  submitting: PropTypes.bool.isRequired,
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
