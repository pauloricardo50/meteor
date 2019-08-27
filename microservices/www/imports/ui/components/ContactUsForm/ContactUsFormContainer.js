import { compose, withState, withProps } from 'recompose';
import { submitContactForm } from 'core/api/methods/methodDefinitions';

export default compose(
  withState('submitSucceeded', 'setSubmitSucceeded', false),
  withProps(({ setSubmitSucceeded }) => ({
    onSubmit: values => submitContactForm.run(values),
    onSubmitSuccess: () => setSubmitSucceeded(true),
  })),
);
