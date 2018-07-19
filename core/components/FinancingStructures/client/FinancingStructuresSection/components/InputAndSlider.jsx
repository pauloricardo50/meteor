// @flow
import React from 'react';
import Slider from 'core/components/Material/Slider';

import MoneyInput from '../../../../MoneyInput';
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
    <MoneyInput value={value || 0} onChange={val => handleChange(val || 0)} />
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
