// @flow
import React from 'react';

import Input from '@material-ui/core/Input';
import Slider from 'core/components/Material/Slider';

type InputAndSliderProps = {
  value: number,
  handleChange: Function,
  max?: number,
};

// If no max is provided, multiply value by 2, or 1 000 000 if it's 0
const initialMaxValue = value => value * 2 || 1000000;

const InputAndSlider = ({
  value,
  handleChange,
  max = initialMaxValue(value),
}: InputAndSliderProps) => (
  <div className="input-and-slider">
    <Input value={value} onChange={handleChange} />
    <Slider
      min={0}
      max={max}
      step={1000}
      value={value}
      onChange={handleChange}
      className="slider"
    />
  </div>
);

export default InputAndSlider;
