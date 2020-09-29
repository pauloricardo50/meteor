import React from 'react';
import { compose } from 'recompose';
import { connectField } from 'uniforms';

import { toMoney } from '../../../../../utils/conversionFunctions';
import { percentFormatters } from '../../../../../utils/formHelpers';
import MoneyInput from '../../../../MoneyInput';
import PercentInput from '../../../../PercentInput';
import TextInput from '../../../../TextInput';
import T, { Money, Percent } from '../../../../Translation';

const valueIsNotDefined = value =>
  value === '' || value === undefined || value === null;

const makeHandleTextChange = ({
  onChange,
  allowUndefined,
  forceUndefined,
  type,
}) => {
  if (type === 'text') {
    return onChange;
  }

  return value => {
    if (allowUndefined && valueIsNotDefined(value)) {
      return onChange('');
    }
    return onChange(value || (forceUndefined && allowUndefined ? '' : 0));
  };
};
const setValue = ({ value, allowUndefined, forceUndefined, type }) => {
  if (type === 'text') {
    return value;
  }

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
        defaultMessage="Max. {max}"
        values={{ max: <FormatComponent value={max} /> }}
      />
    );
  }

  if (typeof value === 'number' && value < min) {
    return (
      <T
        defaultMessage="Min. {min}"
        values={{ min: <FormatComponent value={min} /> }}
      />
    );
  }

  return null;
};

const getInputConfig = type => {
  if (type === 'money') {
    return {
      InputComponent: MoneyInput,
      FormatComponent: Money,
      formatFunc: toMoney,
    };
  }

  if (type === 'percent') {
    return {
      InputComponent: PercentInput,
      FormatComponent: Percent,
      formatFunc: compose(v => `${v}%`, percentFormatters.format),
    };
  }

  if (type === 'text') {
    return {
      InputComponent: TextInput,
      FormatComponent: x => x,
      formatFunc: x => x,
    };
  }
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
    multiline,
    rows,
  } = props;
  const { InputComponent, FormatComponent, formatFunc } = getInputConfig(type);
  const dbValue = structure[name];
  const error = getError({ ...props, FormatComponent });

  return (
    <InputComponent
      value={setValue({ value, allowUndefined, forceUndefined, type })}
      onChange={makeHandleTextChange({
        onChange,
        allowUndefined,
        forceUndefined,
        type,
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
      multiline={multiline}
      rows={rows}
    />
  );
};

export default connectField(FinancingInput);
