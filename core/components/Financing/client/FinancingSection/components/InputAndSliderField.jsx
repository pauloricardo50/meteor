// @flow
import React from 'react';
import connectField from 'uniforms/connectField';
import Slider from 'core/components/Material/Slider';

import MoneyInput from '../../../../MoneyInput';

type InputAndSliderFieldProps = {};

const valueIsNotDefined = value =>
  value === '' || value === undefined || value === null;

const makeHandleTextChange = ({
  onChange,
  max,
  allowUndefined,
  forceUndefined,
}) => (value) => {
  if (allowUndefined && valueIsNotDefined(value)) {
    return onChange('');
  }
  if (max && value) {
    return onChange(Math.min(value, max));
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

export const InputAndSliderField = (props: InputAndSliderFieldProps) => {
  const {
    value,
    onChange,
    placeholder,
    forceUndefined,
    allowUndefined,
    max = 1000000,
  } = props;
  return (
    <>
      <MoneyInput
        value={setValue(value, allowUndefined, forceUndefined)}
        onChange={makeHandleTextChange(props)}
        placeholder={placeholder}
        className="money-input"
      />
      <Slider
        min={0}
        max={max}
        step={1000}
        value={setValue(value, allowUndefined, forceUndefined)}
        onChange={onChange}
        className="slider"
      />
    </>
  );
};

export default connectField(InputAndSliderField);
