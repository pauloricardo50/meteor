// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';

import { withProps } from 'recompose';
import { makeCustomAutoField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';
import CustomSubmitField from './CustomSubmitField';
import T from '../Translation';

type CustomAutoFormProps = {
  autoFieldProps?: Object,
  children?: React.Node,
  model: Object,
  omitFields?: Array<String>,
  placeholder?: Boolean,
  submitFieldProps?: Object,
  submitting?: Boolean,
};

const CustomAutoForm = ({
  autoFieldProps = {},
  children,
  model,
  omitFields,
  placeholder = true,
  submitFieldProps,
  submitting,
  ...props
}: CustomAutoFormProps) => {
  const AutoField = makeCustomAutoField(autoFieldProps);
  return (
    <AutoForm
      showInlineError
      model={pickBy(model, (_, key) => !key.startsWith('$'))}
      placeholder={placeholder}
      className="autoform"
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

export default withProps(({ onSubmit, schema }) => {
  const schemaKeys = schema._schemaKeys;
  return { onSubmit: values => onSubmit(pick(values, schemaKeys)) };
})(CustomAutoForm);
