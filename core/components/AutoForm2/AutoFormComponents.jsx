// @flow
import React from 'react';
import AutoField from 'uniforms-material/AutoField';
import connectField from 'uniforms/connectField';
import DefaultSubmitField from 'uniforms-material/SubmitField';

import T from '../Translation';
import { CUSTOM_AUTOFIELD_TYPES } from './constants';
import DateField from '../DateField';
import { PercentField } from '../PercentInput';
import CustomSelectField from './CustomSelectField';

const determineComponentFromProps = ({
  allowedValues,
  customAllowedValues,
  field: { uniforms },
}) => {
  if (allowedValues || customAllowedValues) {
    return CustomSelectField;
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.DATE) {
    return DateField;
  }

  if (uniforms && uniforms.type === CUSTOM_AUTOFIELD_TYPES.PERCENT) {
    return PercentField;
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
      const Component = determineComponentFromProps(props) || AutoField;
      const label = labels && labels[props.name];
      return <Component {...props} label={selectLabel({ label, props })} />;
    },
    { includeInChain: false },
  );

export const CustomAutoField = makeCustomAutoField({});
