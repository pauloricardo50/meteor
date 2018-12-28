// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pickBy from 'lodash/pickBy';

import { makeCustomAutoField, SubmitField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';
import T from '../Translation';

const CustomAutoForm = ({
  autoFieldProps = {},
  model,
  submitting,
  children,
  omitFields,
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
          <SubmitField
            loading={submitting}
            raised
            primary
            label={<T id="general.ok" />}
          />
        </>
      )}
    </AutoForm>
  );
};

export default CustomAutoForm;
