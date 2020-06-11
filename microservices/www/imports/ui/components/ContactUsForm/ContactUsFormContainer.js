import { compose, withProps, withState } from 'recompose';

import { submitContactForm } from 'core/api/methods/methodDefinitions';
import { dataLayer } from 'core/utils/googleTagManager';

export default compose(
  withState('submitSucceeded', 'setSubmitSucceeded', false),
  withProps(({ setSubmitSucceeded }) => ({
    onSubmit: values => submitContactForm.run(values),
    onSubmitSuccess: () => {
      setSubmitSucceeded(true);
      if (dataLayer()) {
        dataLayer().push({
          event: 'formSubmission',
          formType: 'Contact us',
        });
      }
    },
  })),
);
