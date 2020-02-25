import React from 'react';
import { connectField } from 'uniforms';
import { compose } from 'recompose';

import { toMoney } from 'core/utils/conversionFunctions';
import { percentFormatters } from 'core/utils/formHelpers';
import T, { Money, Percent } from '../../../../Translation';
import MoneyInput from '../../../../MoneyInput';
import PercentInput from '../../../../PercentInput';

const valueIsNotDefined = value =>
  value === '' || value === undefined || value === null;

const makeHandleTextChange = ({
  onChange,
  allowUndefined,
  forceUndefined,
}) => value => {
  if (allowUndefined && valueIsNotDefined(value)) {
    return onChange('');
  }
  return onChange(value || (forceUndefined && allowUndefined ? '' : 0));
};

const setValue = (value, allowUndefined, forceUndefined) => {
  if (allowUndefined) {
    return forceUndefined && value === 0
      ? ''
      : (valueIsNotDefined(value) && '') || value;
  }
  return value || 0;
};

export const FinancingInput = ({
  value,
  placeholder,
  forceUndefined,
  allowUndefined,
  disabled,
  onChange,
  max,
  formRef,
  structure,
  name,
  type = 'money',
}) => {
  const InputComponent = type === 'money' ? MoneyInput : PercentInput;
  const FormatComponent = type === 'money' ? Money : Percent;
  const formatFunc =
    type === 'money'
      ? toMoney
      : compose(v => `${v}%`, percentFormatters.format);
  const dbValue = structure[name];

  const maxExceeded = value > max;
  return (
    <InputComponent
      value={setValue(value, allowUndefined, forceUndefined)}
      onChange={makeHandleTextChange({
        onChange,
        allowUndefined,
        forceUndefined,
      })}
      onBlur={() => {
        if (formRef && formRef.current) {
          if (dbValue !== value) {
            // Small optimization, only submit onBlur if the value has changed
            formRef.current.submit();
          }
        }
      }}
      placeholder={
        placeholder === undefined ? '' : `${formatFunc(placeholder)}`
      } // Placeholders should always be a string
      className="money-input"
      disabled={disabled}
      error={maxExceeded}
      helperText={
        maxExceeded && (
          <T
            id="Financing.maxExceeded"
            values={{ max: <FormatComponent value={max} /> }}
          />
        )
      }
      margin="dense"
      shrink
    />
  );
};

export default connectField(FinancingInput);
