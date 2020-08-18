import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import MaskedInput from 'react-text-mask';

import {
  toDecimalNumber,
  toNegativeNumber,
  toNumber,
} from '../../utils/conversionFunctions';
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
  value,
  ...props
}) => {
  const [maskedValue, setMaskedValue] = useState(value);
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);
  const parse = decimal
    ? toDecimalNumber
    : negative
    ? toNegativeNumber
    : toNumber;

  useEffect(() => {
    if (parse(maskedValue) !== value) {
      setMaskedValue(value);
    }
  }, [value]);

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

  const handleChange = event => {
    setMaskedValue(event.target.value);
    onChange(parse(event.target.value));
  };

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
        onChange={handleChange}
        type="tel"
        inputComponent={MaskedInput}
        inputProps={{ mask }}
        value={maskedValue}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default MoneyInput;
