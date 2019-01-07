// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pickBy from 'lodash/pickBy';

import { makeCustomAutoField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';
import CustomSubmitField from './CustomSubmitField';
import T from '../Translation';

const CustomAutoForm = ({
  autoFieldProps = {},
  model,
  submitting,
  children,
  omitFields,
  submitFieldProps,
  ...props
}) => {
  const AutoField = makeCustomAutoField(autoFieldProps);
  return (
    <AutoForm
      showInlineError
      model={pickBy(model, (_, key) => !key.startsWith('$'))}
      {...props}
    >
      {children || (
        <>
          <CustomAutoFields omitFields={omitFields} autoField={AutoField} />
          <CustomSubmitField
            loading={submitting}
            raised
            primary
            label={<T id="general.ok" />}
            {...submitFieldProps}
          />
        </>
      )}
    </AutoForm>
  );
};

export default CustomAutoForm;
