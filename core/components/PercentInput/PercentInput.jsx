// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import MaskedInput from 'react-text-mask';
import { percentMask } from '../../utils/textMasks';
import { percentFormatters } from '../../utils/formHelpers';

type PercentInputProps = {
  onChange: Function,
  value: number,
};

const PercentInput = ({ onChange, value, ...props }: PercentInputProps) => (
  <Input
    onChange={(event) => {
      onChange(percentFormatters.parse(event.target.value));
    }}
    value={percentFormatters.format(value)}
    inputComponent={MaskedInput}
    inputProps={{ mask: percentMask }}
    type="tel"
    {...props}
  />
);

export default PercentInput;
