import React from 'react';
import MaskedInput from 'react-text-mask';
import cx from 'classnames';

import InputAdornment from '../Material/InputAdornment';
import FormHelperText from '../Material/FormHelperText';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';
import FormControl from '../Material/FormControl';
import Input from '../Material/Input';
import {
  swissFrancMask,
  swissFrancMaskDecimal,
  swissFrancDecimalNegativeMask,
  swissFrancNegativeMask,
} from '../../utils/textMasks';
import { toNumber, toDecimalNumber } from '../../utils/conversionFunctions';

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
