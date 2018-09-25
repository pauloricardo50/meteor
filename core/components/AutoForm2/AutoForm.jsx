// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import SelectField from 'uniforms-material/SelectField';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';

import T from '../Translation';

const CustomSelectField = props => (
  <SelectField
    {...props}
    transform={option => <T id={`Forms.${props.name}.${option}`} />}
  />
);

const determineComponentFromProps = (props) => {
  if (props.allowedValues) {
    return CustomSelectField;
  }

  return false;
};

export const CustomAutoField = connectField(
  (props) => {
    const Component = determineComponentFromProps(props) || AutoField;
    return <Component {...props} label={<T id={`Forms.${props.name}`} />} />;
  },
  { includeInChain: false },
);

const CustomAutoForm = props => (
  <AutoForm {...props} autoField={CustomAutoField} />
);

export default CustomAutoForm;
