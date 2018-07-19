// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import { toNumber, toMoney } from '../../utils/conversionFunctions';

type MoneyInputProps = {
  onChange: Function,
  value: number,
};

const MoneyInput = ({ onChange, value, ...props }: MoneyInputProps) => (
  <Input
    startAdornment={<InputAdornment position="start">CHF</InputAdornment>}
    onChange={event => onChange(toNumber(event.target.value))}
    value={toMoney(value)}
    type="tel"
    {...props}
  />
);

export default MoneyInput;
