// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import { CustomAutoField, SubmitField } from './AutoFormComponents';

console.log('CustomAutoField', CustomAutoField);

const CustomAutoForm = ({ autoFieldProps, ...props }) => (
  <AutoForm
    showInlineError
    autoField={CustomAutoField(autoFieldProps)}
    submitField={SubmitField}
    {...props}
  />
);

export default CustomAutoForm;
