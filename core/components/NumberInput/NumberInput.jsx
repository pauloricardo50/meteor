import React from 'react';

import { numberFormatters } from '../../utils/formHelpers';
import Input from '../Material/Input';

const NumberInput = ({ onChange, value, ...props }) => (
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
