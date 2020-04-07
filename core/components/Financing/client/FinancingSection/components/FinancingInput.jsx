import React from 'react';
import { compose } from 'recompose';
import { connectField } from 'uniforms';

import { toMoney } from '../../../../../utils/conversionFunctions';
import { percentFormatters } from '../../../../../utils/formHelpers';
import MoneyInput from '../../../../MoneyInput';
import PercentInput from '../../../../PercentInput';
import T, { Money, Percent } from '../../../../Translation';

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

const defaultGetError = ({ value, max, min, FormatComponent }) => {
  if (typeof value === 'number' && value > max) {
    return (
      <T
        id="Financing.maxExceeded"
        values={{ max: <FormatComponent value={max} /> }}
      />
    );
  }

  if (typeof value === 'number' && value < min) {
    return (
      <T
        id="Financing.belowMin"
        values={{ min: <FormatComponent value={min} /> }}
      />
    );
  }

  return null;
};

export const FinancingInput = props => {
  const {
    value,
    placeholder,
    forceUndefined,
    allowUndefined,
    disabled,
    onChange,
    formRef,
    structure,
    name,
    type = 'money',
    getError = defaultGetError,
    helperText,
  } = props;
  const InputComponent = type === 'money' ? MoneyInput : PercentInput;
  const FormatComponent = type === 'money' ? Money : Percent;
  const formatFunc =
    type === 'money'
      ? toMoney
      : compose(v => `${v}%`, percentFormatters.format);
  const dbValue = structure[name];
  const error = getError({ ...props, FormatComponent });

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
      error={!!error}
      helperText={error || helperText}
      margin="dense"
      shrink
    />
  );
};

export default connectField(FinancingInput);
