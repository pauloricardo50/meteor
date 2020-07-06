import React, { forwardRef } from 'react';
import Chip from '@material-ui/core/Chip';

export default forwardRef((props, ref) => (
  <Chip size="small" variant="outlined" ref={ref} {...props} />
));
