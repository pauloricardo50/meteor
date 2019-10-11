// @flow
import React, { useState } from 'react';
import { Slider as MuiSlider } from '@material-ui/core';
import { useDebounce } from 'react-use';

type SliderProps = {};

const Slider = ({
  min = 0,
  max,
  defaultValue = 0,
  value,
  onChange,
  tipFormatter = x => x,
  debounce = true,
  className,
  ...rest
}: SliderProps) => {
  const [fastValue, setFastValue] = useState(value);

  // Only send the slider value to its parent after the slider has been
  // untouched for 300ms. This avoids performance issues if the slider value
  // is passed through other components that are expensive to update
  useDebounce(() => debounce && onChange(fastValue), 300, [fastValue]);

  return (
    <MuiSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      value={debounce ? fastValue : value}
      onChange={debounce ? setFastValue : (event, value) => onChange(value)}
      valueLabelFormat={tipFormatter}
      {...rest}
    />
  );
};

export default Slider;
