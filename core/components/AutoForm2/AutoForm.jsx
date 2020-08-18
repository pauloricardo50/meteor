import React, { forwardRef, useMemo } from 'react';
import cx from 'classnames';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm } from 'uniforms-material';

import { CustomAutoField, makeCustomAutoField } from './AutoFormComponents';
import AutoFormLayout from './AutoFormLayout';
import CustomAutoFields from './CustomAutoFields';
import CustomSubmitField from './CustomSubmitField';

const CustomAutoForm = (
  {
    autoFieldProps,
    children,
    layout,
    model,
    omitFields,
    onSubmit,
    onSuccessMessage,
    placeholder = true,
    schema,
    submitFieldProps,
    className,
    ...props
  },
  ref,
) => {
  const schemaKeys = schema._schemaKeys;
  const handleSubmit = values => {
    const finalValues = pick(values, [...schemaKeys, '_id']);

    return Promise.resolve(onSubmit(finalValues)).then(() =>
      import('../../utils/message').then(({ default: message }) => {
        message.success(
          onSuccessMessage
            ? typeof onSuccessMessage === 'function'
              ? onSuccessMessage(finalValues)
              : onSuccessMessage
            : "C'est dans la boite !",
          5,
        );
      }),
    );
  };
  const bridgedSchema = useMemo(() => new SimpleSchema2Bridge(schema), [
    schema,
  ]);

  const autoField = useMemo(() => {
    if (autoFieldProps) {
      console.log('autoFieldProps:', autoFieldProps);
      return makeCustomAutoField(autoFieldProps);
    }
    return CustomAutoField;
  }, []);

  return (
    <AutoForm
      showInlineError
      model={pickBy(model, (_, key) => !key.startsWith('$'))}
      placeholder={placeholder}
      className={cx('autoform', className)}
      onSubmit={handleSubmit}
      schema={bridgedSchema}
      ref={ref}
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

export default forwardRef(CustomAutoForm);
