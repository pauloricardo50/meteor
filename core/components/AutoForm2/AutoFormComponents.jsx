// @flow
import React from 'react';
import SelectField from 'uniforms-material/SelectField';
import AutoField from 'uniforms-material/AutoField';
import AutoFields from 'uniforms-material/AutoFields';
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

const selectLabel = ({ label, props: { name, label: directLabel } }) =>
  (label === null ? null : directLabel || label || <T id={`Forms.${name}`} />);

export const makeCustomAutoField = ({ labels } = {}) =>
  connectField(
    (props) => {
      const Component = determineComponentFromProps(props) || AutoField;
      const label = labels && labels[props.name];
      return <Component {...props} label={selectLabel({ label, props })} />;
    },
    { includeInChain: false },
  );

export const CustomAutoField = makeCustomAutoField({});

export const CustomAutoFields = props => <AutoFields {...props} />;
