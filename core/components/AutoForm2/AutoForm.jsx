// @flow
import React, { PureComponent } from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';

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

class CustomAutoForm extends PureComponent<CustomAutoFormProps> {
  constructor(props) {
    super(props);
    const { autoFieldProps } = props;

    if (autoFieldProps) {
      this.autoField = makeCustomAutoField(autoFieldProps);
    } else {
      this.autoField = CustomAutoField;
    }
  }

  handleSubmit = (...args) => {
    const { onSubmit, onSuccessMessage } = this.props;

    return Promise.resolve(onSubmit(...args)).then(() =>
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
  };

  render() {
    const {
      children,
      model,
      omitFields,
      placeholder = true,
      submitFieldProps,
      layout,
      schemaKeys,
      onSubmit,
      onSuccessMessage,
      ...props
    } = this.props;

    return (
      <AutoForm
        showInlineError
        model={pickBy(model, (_, key) => !key.startsWith('$'))}
        placeholder={placeholder}
        className="autoform"
        onSubmit={this.handleSubmit}
        {...props}
      >
        {children || (
          <>
            {layout ? (
              <AutoFormLayout
                AutoField={this.autoField}
                layout={layout}
                schemaKeys={schemaKeys}
              />
            ) : (
              <CustomAutoFields
                omitFields={omitFields}
                autoField={this.autoField}
              />
            )}
            <CustomSubmitField {...submitFieldProps} />
          </>
        )}
      </AutoForm>
    );
  }
}

export default withProps(({ onSubmit, schema }) => {
  const schemaKeys = schema._schemaKeys;
  return {
    onSubmit: (values) => onSubmit(pick(values, [...schemaKeys, '_id'])),
    schemaKeys,
  };
})(CustomAutoForm);
