// @flow
import React, { useState } from 'react';
import RCSlider from 'rc-slider';
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
  ...rest
}: SliderProps) => {
  const [fastValue, setFastValue] = useState(value);

  // Only send the slider value to its parent after the slider has been
  // untouched for 300ms. This avoids performance issues if the slider value
  // is passed through other components that are expensive to update
  useDebounce(() => debounce && onChange(fastValue), 300, [fastValue]);

  return (
    <RCSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      value={debounce ? fastValue : value}
      onChange={debounce ? setFastValue : onChange}
      tipFormatter={tipFormatter}
      {...rest}
    />
  );
};

export default Slider;
