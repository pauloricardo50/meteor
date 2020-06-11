import React from 'react';
import cx from 'classnames';
import MaskedInput from 'react-text-mask';

import { percentFormatters } from '../../utils/formHelpers';
import { percentMask } from '../../utils/textMasks';
import FormControl from '../Material/FormControl';
import FormHelperText from '../Material/FormHelperText';
import Input from '../Material/Input';
import InputLabel, { useInputLabelWidth } from '../Material/InputLabel';

const PercentInputComponent = ({ onChange, value, ...props }) => (
  <Input
    onChange={event => onChange(percentFormatters.parse(event.target.value))}
    value={percentFormatters.format(value)}
    inputComponent={MaskedInput}
    inputProps={{ mask: percentMask }}
    type="tel"
    {...props}
  />
);
// A hack for number inputs because material-ui can't be sure of the initial
// shrink value: https://material-ui.com/components/text-fields/#floating-label
const shouldShrinkLabel = value => !!value || undefined;

const PercentInput = ({
  fullWidth = true,
  helperText,
  label,
  required,
  margin,
  className,
  shrink,
  ...props
}) => {
  const { inputLabelRef, labelWidth } = useInputLabelWidth(!!label);

  return (
    <FormControl
      className={cx('percent-input', className)}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
    >
      <InputLabel
        ref={inputLabelRef}
        shrink={shrink || shouldShrinkLabel(props.value)}
      >
        {label}
      </InputLabel>
      <PercentInputComponent
        labelWidth={labelWidth}
        notched={shouldShrinkLabel(props.value)}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PercentInput;
