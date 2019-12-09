// @flow
import React, { useMemo } from 'react';
import { AutoForm } from 'uniforms-material';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';

import { withProps } from 'recompose';
import { makeCustomAutoField, CustomAutoField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';
import CustomSubmitField from './CustomSubmitField';
import AutoFormLayout from './AutoFormLayout';

type CustomAutoFormProps = {
  autoFieldProps?: Object,
  children?: React.Node,
  layout?: any,
  model: Object,
  omitFields?: Array<String>,
  placeholder?: Boolean,
  schemaKeys: Array<String>,
  submitFieldProps?: Object,
  submitting?: Boolean,
};

const CustomAutoForm = ({
  autoFieldProps,
  children,
  layout,
  model,
  omitFields,
  onSubmit,
  onSuccessMessage,
  placeholder = true,
  schema,
  schemaKeys,
  submitFieldProps,
  ...props
}: CustomAutoFormProps) => {
  const handleSubmit = (...args) =>
    Promise.resolve(onSubmit(...args)).then(() =>
      import('../../utils/message').then(({ default: message }) => {
        message.success(
          onSuccessMessage
            ? typeof onSuccessMessage === 'function'
              ? onSuccessMessage(...args)
              : onSuccessMessage
            : "C'est dans la boite !",
          5,
        );
      }),
    );

  const bridgedSchema = useMemo(() => new SimpleSchema2Bridge(schema), [
    schema,
  ]);

  const autoField = useMemo(() => {
    if (autoFieldProps) {
      return makeCustomAutoField(autoFieldProps);
    }
    return CustomAutoField;
  }, []);

  return (
    <AutoForm
      showInlineError
      model={pickBy(model, (_, key) => !key.startsWith('$'))}
      placeholder={placeholder}
      className="autoform"
      onSubmit={handleSubmit}
      schema={bridgedSchema}
      {...props}
    >
      {children || (
        <>
          {layout ? (
            <AutoFormLayout
              AutoField={autoField}
              layout={layout}
              schemaKeys={schemaKeys}
            />
          ) : (
            <CustomAutoFields omitFields={omitFields} autoField={autoField} />
          )}
          <CustomSubmitField {...submitFieldProps} />
        </>
      )}
    </AutoForm>
  );
};

export default withProps(({ onSubmit, schema }) => {
  const schemaKeys = schema._schemaKeys;
  return {
    onSubmit: values => onSubmit(pick(values, [...schemaKeys, '_id'])),
    schemaKeys,
  };
})(CustomAutoForm);
