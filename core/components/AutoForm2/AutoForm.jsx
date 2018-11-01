// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import pickBy from 'lodash/pickBy';

import { makeCustomAutoField, SubmitField } from './AutoFormComponents';

const CustomAutoForm = ({ autoFieldProps = {}, model, ...props }) => (
  <AutoForm
    autoField={makeCustomAutoField(autoFieldProps)}
    showInlineError
    submitField={SubmitField}
    // https://github.com/aldeed/simple-schema-js/issues/310
    model={pickBy(model, (_, key) => !key.startsWith('$'))}
    {...props}
  />
);

export default CustomAutoForm;
