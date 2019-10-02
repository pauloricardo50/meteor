// @flow
import React from 'react';
import connectField from 'uniforms/connectField';
import Slider from 'core/components/Slider';

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
    maxSlider,
    disabled,
  } = props;
  const maxSliderValue = maxSlider || max;
  return (
    <>
      <MoneyInput
        value={setValue(value, allowUndefined, forceUndefined)}
        onChange={makeHandleTextChange(props)}
        placeholder={placeholder === undefined ? '' : `${placeholder}`} // Placeholders should always be a string
        className="money-input"
        disabled={disabled}
      />
      <Slider
        min={0}
        max={Math.max(maxSliderValue, value)}
        step={1000}
        value={setValue(value, allowUndefined, forceUndefined)}
        onChange={onChange}
        className="slider"
        disabled={disabled}
        debounce={false}
      />
    </>
  );
};

export default connectField(InputAndSliderField);
