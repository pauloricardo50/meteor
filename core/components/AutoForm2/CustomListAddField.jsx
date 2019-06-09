// @flow
import React from 'react';
import ListAddField from 'uniforms-material/ListAddField';

import { iconMap as IconMap } from '../Icon/Icon';

type CustomListAddFieldProps = {};

const CustomListAddField = (props: CustomListAddFieldProps) => (
  <ListAddField
    color="primary"
    className="list-add-field"
    {...props}
    icon={<IconMap.add />}
  />
);

export default CustomListAddField;
