// @flow
import React from 'react';
import DefaultAutoField from 'uniforms-material/AutoField';

import T from '../Translation';

type AutoFieldProps = {};

const AutoField = (props: AutoFieldProps) => (
  <DefaultAutoField {...props} label={<T id={`Forms.${props.name}`} />} />
);

export default AutoField;
