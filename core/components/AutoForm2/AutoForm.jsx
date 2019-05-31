// @flow
import React, { PureComponent } from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';

import { withProps } from 'recompose';
import { makeCustomAutoField, CustomAutoField } from './AutoFormComponents';
import CustomAutoFields from './CustomAutoFields';
import CustomSubmitField from './CustomSubmitField';

type CustomAutoFormProps = {
  autoFieldProps?: Object,
  children?: React.Node,
  model: Object,
  omitFields?: Array<String>,
  placeholder?: Boolean,
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

  render() {
    const {
      children,
      model,
      omitFields,
      placeholder = true,
      submitFieldProps,
      ...props
    } = this.props;

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
            <CustomAutoFields
              omitFields={omitFields}
              autoField={this.autoField}
            />
            <CustomSubmitField {...submitFieldProps} />
          </>
        )}
      </AutoForm>
    );
  }
}
export default withProps(({ onSubmit, schema }) => {
  const schemaKeys = schema._schemaKeys;
  return { onSubmit: values => onSubmit(pick(values, [...schemaKeys, '_id'])) };
})(CustomAutoForm);
