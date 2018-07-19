// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import Slider from 'core/components/Material/Slider';

import StructureUpdateContainer from './StructureUpdateContainer';

type InputAndSliderProps = {
  value: number,
  handleChange: Function,
  max?: number,
};

const InputAndSlider = ({
  value,
  handleChange,
  max = 1000000,
}: InputAndSliderProps) => (
  <div className="input-and-slider">
    <Input value={value} onChange={event => handleChange(event.target.value)} />
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

export default StructureUpdateContainer(InputAndSlider);
