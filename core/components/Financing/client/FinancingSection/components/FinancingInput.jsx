import React from 'react';
import { connectField } from 'uniforms';

import T, { Money } from '../../../../Translation';
import MoneyInput from '../../../../MoneyInput';

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
}) => {
  const dbValue = structure[name];

  const maxExceeded = value > max;
  return (
    <>
      <MoneyInput
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
        placeholder={placeholder === undefined ? '' : `${placeholder}`} // Placeholders should always be a string
        className="money-input"
        disabled={disabled}
        error={maxExceeded}
        helperText={
          maxExceeded && (
            <T
              id="Financing.maxExceeded"
              values={{ max: <Money value={max} /> }}
            />
          )
        }
      />
    </>
  );
};

export default connectField(FinancingInput);
