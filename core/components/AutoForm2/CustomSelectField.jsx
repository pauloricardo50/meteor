// @flow
import React from 'react';
import SelectField from 'uniforms-material/SelectField';

import { compose } from 'recompose';
import CustomSelectFieldContainer from './CustomSelectFieldContainer';
import { ignoreProps } from '../../containers/updateForProps';

type CustomSelectFieldProps = {
  transform: Function,
  allowedValues: Array,
  customAllowedValues: Function,
  model: Object,
};

const CustomSelectField = ({
  transform,
  values = [],
  renderValue,
  ...props
}: CustomSelectFieldProps) => (
  <SelectField
    {...props}
    allowedValues={values}
    transform={transform}
    renderValue={renderValue}
    labelProps={{ shrink: true }}
  />
);

export default compose(
  CustomSelectFieldContainer,
  React.memo,
  ignoreProps(['label', 'InputLabelProps', 'onChange', 'changedMap']),
)(CustomSelectField);
