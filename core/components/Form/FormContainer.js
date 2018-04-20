import { compose, withProps } from 'recompose';
import { injectIntl } from 'react-intl';
import { reduxForm } from 'redux-form';

export default compose(
  injectIntl,
  withProps(({ formArray, intl: { formatMessage }, intlPrefix }) => ({
    formArray: formArray.map(field => ({
      ...field,
      placeholder: field.placeholder
        ? formatMessage({ id: `${intlPrefix}.${field.id}.placeholder` })
        : undefined,
    })),
  })),
  reduxForm(),
);
