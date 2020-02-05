import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import { connectField, injectName, joinName } from 'uniforms';
import { wrapField } from 'uniforms-material';

import { CustomAutoField } from './AutoFormComponents';

const Nest = ({ children, fields, itemProps, label, name, ...props }) =>
  wrapField(
    { ...props, component: undefined },
    label && <FormLabel component="legend">{label}</FormLabel>,
    children
      ? injectName(name, children)
      : fields.map(key => (
          <CustomAutoField
            key={key}
            name={joinName(name, key)}
            {...itemProps}
          />
        )),
  );

Nest.defaultProps = {
  fullWidth: true,
  margin: 'none',
};

export default connectField(Nest, {
  ensureValue: false,
  includeInChain: false,
  includeParent: true,
});
