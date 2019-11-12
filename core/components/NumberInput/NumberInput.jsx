// @flow
import React from 'react';

import Input from '../Material/Input';
import { numberFormatters } from '../../utils/formHelpers';

type NumberInputProps = {};

const NumberInput = ({ onChange, value, ...props }: NumberInputProps) => (
  <Input
    onChange={event => {
      onChange(numberFormatters.parse(event.target.value));
    }}
    value={value}
    type="tel"
    {...props}
  />
);

export default NumberInput;
