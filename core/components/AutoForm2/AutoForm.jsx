// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import SelectField from 'uniforms-material/SelectField';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';

import T from '../Translation';
import Button from '../Button';

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

export const SubmitField = props => <Button type="submit" {...props} />;

export const CustomAutoField = ({ labels } = {}) =>
  connectField(
    (props) => {
      const Component = determineComponentFromProps(props) || AutoField;
      const label = labels && labels[props.name];
      return (
        <Component
          {...props}
          label={label || <T id={`Forms.${props.name}`} />}
        />
      );
    },
    { includeInChain: false },
  );

const CustomAutoForm = ({ autoFieldProps, ...props }) => (
  <AutoForm
    {...props}
    autoField={CustomAutoField(autoFieldProps)}
    submitField={SubmitField}
  />
);

export default CustomAutoForm;
