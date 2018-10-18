// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import { makeCustomAutoField, SubmitField } from './AutoFormComponents';

const CustomAutoForm = ({ autoFieldProps, ...props }) => (
  <AutoForm
    {...props}
    autoField={makeCustomAutoField(autoFieldProps)}
    showInlineError
    submitField={SubmitField}
    {...props}
  />
);

export default CustomAutoForm;
