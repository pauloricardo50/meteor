import React from 'react';
import cx from 'classnames';
import MaskedInput from 'react-text-mask';

import { toDecimalNumber, toNumber } from '../../utils/conversionFunctions';
import {
  swissFrancDecimalNegativeMask,
  swissFrancMask,
  swissFrancMaskDecimal,
  swissFrancNegativeMask,
} from '../../utils/textMasks';
import FormControl from '../Material/FormControl';
import FormHelperText from '../Material/FormHelperText';
import Input from '../Material/Input';
import InputAdornment from '../Material/InputAdornment';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';

const MoneyInput = ({
  decimal = false,
  fullWidth = true,
  helperText,
  label,
  margin,
  negative = false,
  onChange,
  required,
  className,
  ...props
}) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);
  const parse = decimal ? toDecimalNumber : toNumber;

  let mask;
  if (decimal) {
    if (negative) {
      mask = swissFrancDecimalNegativeMask;
    } else {
      mask = swissFrancMaskDecimal;
    }
  } else if (negative) {
    mask = swissFrancNegativeMask;
  } else {
    mask = swissFrancMask;
  }

  return (
    <FormControl
      className={cx('money-input', className)}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
    >
      {label && <InputLabel ref={inputLabelRef}>{label}</InputLabel>}
      <Input
        labelWidth={labelWidth}
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
