// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';

import { swissFrancMask } from '../../utils/textMasks';
import { toNumber } from '../../utils/conversionFunctions';

type MoneyInputProps = {
  onChange: Function,
  value: number,
  fullWidth?: boolean,
  label?: React.Node,
  helperText?: React.Node,
  required?: boolean,
};

const MoneyInput = ({
  fullWidth = true,
  helperText,
  label,
  onChange,
  required,
  ...props
}: MoneyInputProps) => (
  <FormControl
    className="money-input"
    required={required}
    fullWidth={fullWidth}
  >
    {label && <InputLabel>{label}</InputLabel>}
    <Input
      startAdornment={<InputAdornment position="start">CHF</InputAdornment>}
      onChange={event => onChange(toNumber(event.target.value))}
      type="tel"
      inputComponent={MaskedInput}
      inputProps={{ mask: swissFrancMask }}
      {...props}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

export default MoneyInput;
