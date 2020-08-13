import React from 'react';
import { ListDelField } from 'uniforms-material';

const CustomListDelField = props => (
  <ListDelField className="list-del-field" size="small" {...props} />
);

export default React.memo(CustomListDelField);
