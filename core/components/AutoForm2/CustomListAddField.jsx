import React from 'react';
import { ListAddField } from 'uniforms-material';

const CustomListAddField = props => (
  <ListAddField
    color="primary"
    className="list-add-field"
    size="small"
    {...props}
  />
);

export default CustomListAddField;
