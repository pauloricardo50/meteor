import { compose, withState } from 'recompose';
import { createContainer } from 'core/api/containerToolkit/';
import { submitContactForm } from 'core/api/methods';

export default compose(
  withState('submitSucceeded', 'setSubmitSucceeded', false),
  createContainer(({ setSubmitSucceeded }) => ({
    onSubmit: values => submitContactForm.run(values),
    onSubmitSuccess: () => setSubmitSucceeded(true),
  })),
);
