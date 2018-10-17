// @flow
import React from 'react';
import AutoForm from 'uniforms-material/AutoForm';
import SelectField from 'uniforms-material/SelectField';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';

import T from '../Translation';
import Button from '../Button';

const CustomSelectField = ({ transform, ...props }) => (
  <SelectField
    {...props}
    transform={
      transform || (option => <T id={`Forms.${props.name}.${option}`} />)
    }
    displayEmpty
  />
);

const determineComponentFromProps = (props) => {
  if (props.allowedValues) {
    return CustomSelectField;
  }

  return false;
};

export const SubmitField = props => (
  <Button
    type="submit"
    children={<T id="general.save" />}
    raised
    primary
    {...props}
  />
);

export const makeCustomAutoField = ({ labels } = {}) =>
  connectField(
    (props) => {
      const Component = determineComponentFromProps(props) || AutoField;
      const label = labels && labels[props.name];
      return (
        <Component
          {...props}
          label={
            label === null ? null : label || <T id={`Forms.${props.name}`} />
          }
        />
      );
    },
    { includeInChain: false },
  );

export const CustomAutoField = makeCustomAutoField({});

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
