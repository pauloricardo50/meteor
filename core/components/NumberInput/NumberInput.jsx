//      
import React from 'react';

import Input from '../Material/Input';
import { numberFormatters } from '../../utils/formHelpers';

                           

const NumberInput = ({ onChange, value, ...props }                  ) => (
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
