// @flow
import React from 'react';
import SelectField from 'uniforms-material/SelectField';
import AutoField from 'uniforms-material/AutoField';
import AutoFields from 'uniforms-material/AutoFields';
import connectField from 'uniforms/connectField';
import DefaultSubmitField from 'uniforms-material/SubmitField';

import T from '../Translation';
import { CUSTOM_AUTOFIELD_TYPES } from './constants';
import DateField from '../DateField';
import PercentInput from '../PercentInput/PercentInput';

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

  if (
    props.field.uniforms
    && props.field.uniforms.type === CUSTOM_AUTOFIELD_TYPES.DATE
  ) {
    return DateField;
  }

  if (
    props.field.uniforms
    && props.field.uniforms.type === CUSTOM_AUTOFIELD_TYPES.PERCENT
  ) {
    return PercentInput;
  }

  return false;
};

export const SubmitField = props => (
  <DefaultSubmitField
    label={<T id="general.save" />}
    variant="raised"
    color="primary"
    {...props}
  />
);

const selectLabel = ({ label, props: { name, overrideLabel } }) =>
  (label === null ? null : overrideLabel || label || <T id={`Forms.${name}`} />);

export const makeCustomAutoField = ({ labels } = {}) =>
  connectField(
    (props) => {
      console.log('Getting component for ', props.name);

      const Component = determineComponentFromProps(props) || AutoField;
      const label = labels && labels[props.name];
      return <Component {...props} label={selectLabel({ label, props })} />;
    },
    { includeInChain: false },
  );

export const CustomAutoField = makeCustomAutoField({});

export const CustomAutoFields = AutoFields;
