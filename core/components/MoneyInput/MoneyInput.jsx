// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask';

import { swissFrancMask, swissFrancMaskDecimal } from '../../utils/textMasks';
import { toNumber, toDecimalNumber } from '../../utils/conversionFunctions';

type MoneyInputProps = {
  fullWidth?: boolean,
  helperText?: React.Node,
  label?: React.Node,
  margin?: string,
  onChange: Function,
  required?: boolean,
  value: number,
};

const MoneyInput = ({
  fullWidth = true,
  helperText,
  label,
  onChange,
  required,
  margin,
  decimal = false,
  ...props
}: MoneyInputProps) => {
  const parse = decimal ? toDecimalNumber : toNumber;
  const mask = decimal ? swissFrancMaskDecimal : swissFrancMask;

  return (
    <FormControl
      className="money-input"
      required={required}
      fullWidth={fullWidth}
      margin={margin}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Input
        startAdornment={<InputAdornment position="start">CHF</InputAdornment>}
        onChange={event => onChange(parse(event.target.value))}
        type="tel"
        inputComponent={MaskedInput}
        inputProps={{ mask }}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
export default MoneyInput;
