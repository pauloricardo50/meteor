import { compose, withProps } from 'recompose';
import { injectIntl } from 'react-intl';
import { reduxForm, SubmissionError } from 'redux-form';

export default compose(
  injectIntl,
  withProps(({ formArray, intl: { formatMessage }, intlPrefix, onSubmit }) => ({
    formArray: formArray.map(field => ({
      ...field,
      placeholder:
        field.placeholder === true
          ? formatMessage({ id: `${intlPrefix}.${field.id}.placeholder` })
          : field.placeholder,
    })),
    onSubmit: (...args) =>
      onSubmit(...args).catch((submitError) => {
        throw new SubmissionError({ _error: submitError.message });
      }),
  })),
  reduxForm(),
);
