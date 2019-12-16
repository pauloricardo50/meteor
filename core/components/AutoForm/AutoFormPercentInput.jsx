// @flow
import React, { useState } from 'react';
import AutoFormTextInput from './AutoFormTextInput';

type AutoFormPercentInputProps = {};

const AutoFormPercentInput = (props: AutoFormPercentInputProps) => {
  const { inputProps } = props;
  const [focused, setFocused] = useState(false);

  return (
    <AutoFormTextInput
      {...props}
      showValidIconOnChange
      savingIconStyle={{ top: 10 }}
      inputProps={{
        ...inputProps,
        inputType: 'percent',
        percent: true,
        onFocusChange: ({ focused: nextFocused }) => setFocused(nextFocused),
        focused,
        placeholder: null,
        notched: true,
      }}
      inputLabelProps={{ shrink: true }}
    />
  );
};

export default AutoFormPercentInput;
