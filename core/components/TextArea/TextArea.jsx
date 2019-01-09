// @flow
import React from 'react';

import TextField from 'uniforms-material/TextField';

type TextAreaProps = {};

const TextArea = (props: TextAreaProps) => {
  const { value, rows = 10, width = '500px' } = props;
  return (
    <TextField
      {...props}
      type="textarea"
      value={value}
      multiline
      rows={rows}
      rowsMax={rows}
      InputLabelProps={{ shrink: true }}
      style={{ width }}
    />
  );
};

export default TextArea;
