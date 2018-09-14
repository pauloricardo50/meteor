// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import { toNumber, toMoney } from '../../utils/conversionFunctions';

type MoneyInputProps = {
  onChange: Function,
  value: number,
};

const MoneyInput = ({
  onChange,
  value,
  label,
  helperText,
  ...props
}: MoneyInputProps) => (
  <FormControl className="money-input">
    {label && <InputLabel>{label}</InputLabel>}
    <Input
      startAdornment={<InputAdornment position="start">CHF</InputAdornment>}
      onChange={event => onChange(toNumber(event.target.value))}
      value={toMoney(value)}
      type="tel"
      {...props}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export default MoneyInput;
