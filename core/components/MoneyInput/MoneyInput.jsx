//      
import React from 'react';
import MaskedInput from 'react-text-mask';

import InputAdornment from '../Material/InputAdornment';
import FormHelperText from '../Material/FormHelperText';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';
import FormControl from '../Material/FormControl';
import Input from '../Material/Input';
import {
  swissFrancMask,
  swissFrancMaskDecimal,
  swissFrancDecimalNegativeMask,
} from '../../utils/textMasks';
import { toNumber, toDecimalNumber } from '../../utils/conversionFunctions';

                        
                      
                          
                     
                  
                     
                     
                
  

const MoneyInput = ({
  fullWidth = true,
  helperText,
  label,
  onChange,
  required,
  margin,
  decimal = false,
  negative = false,
  ...props
}                 ) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);
  const parse = decimal ? toDecimalNumber : toNumber;

  const mask = decimal
    ? negative
      ? swissFrancDecimalNegativeMask
      : swissFrancMaskDecimal
    : swissFrancMask;

  return (
    <FormControl
      className="money-input"
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
