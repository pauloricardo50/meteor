import React from 'react';

import AutoFormTextInput from './AutoFormTextInput';

const AutoFormPercentInput = props => {
  const { InputProps } = props;

  return (
    <AutoFormTextInput
      {...props}
      showValidIconOnChange
      InputProps={{
        ...InputProps,
        inputType: 'percent',
        percent: true,
        placeholder: '100',
        notched: true,
      }}
      InputLabelProps={{ shrink: true }}
    />
  );
};

export default AutoFormPercentInput;
