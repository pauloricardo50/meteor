// @flow
import React from 'react';
import AutoFormTextInput from './AutoFormTextInput';

type AutoFormPercentInputProps = {};

const AutoFormPercentInput = (props: AutoFormPercentInputProps) => {
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
