import React from 'react';
import AutoFormTextInput from './AutoFormTextInput';

const AutoFormPercentInput = props => {
  const { inputProps } = props;

  return (
    <AutoFormTextInput
      {...props}
      showValidIconOnChange
      inputProps={{
        ...inputProps,
        inputType: 'percent',
        percent: true,
        placeholder: '100',
        notched: true,
      }}
      inputLabelProps={{ shrink: true }}
    />
  );
};

export default AutoFormPercentInput;
