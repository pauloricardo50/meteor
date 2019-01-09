// @flow
import React from 'react';
import SelectField from 'uniforms-material/SelectField';

import Loading from '../Loading/Loading';
import CustomSelectFieldContainer from './CustomSelectFieldContainer';

type CustomSelectFieldProps = {
  transform: Function,
  allowedValues: Array,
  customAllowedValues: Function,
  model: Object,
};

const CustomSelectField = ({
  transform,
  values = [],
  displayEmpty = true,
  renderValue,
  ...props
}: CustomSelectFieldProps) => (values ? (
  <SelectField
    {...props}
    allowedValues={values}
    transform={transform}
    renderValue={renderValue}
    displayEmpty={displayEmpty}
    labelProps={{ shrink: true }}
  />
) : (
  <Loading />
));

export default CustomSelectFieldContainer(CustomSelectField);
