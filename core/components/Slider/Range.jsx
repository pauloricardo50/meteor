// @flow
import React, { useState } from 'react';
import RCSlider from 'rc-slider';
import { useDebounce } from 'react-use';

const { createSliderWithTooltip } = RCSlider;
const RangeSlider = createSliderWithTooltip(RCSlider.Range);

type RangeProps = {};

const Range = ({
  min = 0,
  max,
  defaultValue = [0],
  value,
  onChange,
  tipFormatter = x => x,
  ...rest
}: RangeProps) => {
  const [fastValue, setFastValue] = useState(value);

  // Only send the slider value to its parent after the slider has been
  // untouched for 300ms. This avoids performance issues if the slider value
  // is passed through other components that are expensive to update
  useDebounce(() => onChange(fastValue), 300, [fastValue]);

  return (
    <RangeSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      value={fastValue}
      onChange={setFastValue}
      allowCross={false}
      pushable
      tipFormatter={tipFormatter}
      {...rest}
    />
  );
};

export default Range;
