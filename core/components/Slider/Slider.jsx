// @flow
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'react-use';

import MuiSlider from '../Material/Slider';
import Tooltip from '../Material/Tooltip';

type SliderProps = {};

const formatTooltip = (props) => {
  const { children, value, open, valueLabelFormat, valueLabelDisplay } = props;

  if (valueLabelDisplay === 'off') {
    return null;
  }

  const popperRef = useRef(null);
  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      title={valueLabelFormat(value)}
      open={open}
      placement="top"
      PopperProps={{ popperRef }}
    >
      {children}
    </Tooltip>
  );
};

const Slider = ({
  min = 0,
  max,
  defaultValue = 0,
  value,
  onChange,
  valueLabelFormat,
  debounce = true,
  ...rest
}: SliderProps) => {
  const [fastValue, setFastValue] = useState(value);

  // Only send the slider value to its parent after the slider has been
  // untouched for 300ms. This avoids performance issues if the slider value
  // is passed through other components that are expensive to update
  useDebounce(() => debounce && onChange(fastValue), 300, [fastValue]);

  const handleChange = (event, newValue) => {
    setFastValue(newValue);
  };

  return (
    <MuiSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      value={debounce ? fastValue : value}
      onChange={debounce ? handleChange : (event, v) => onChange(v)}
      valueLabelFormat={valueLabelFormat}
      ValueLabelComponent={valueLabelFormat ? formatTooltip : undefined}
      valueLabelDisplay={valueLabelFormat ? 'auto' : 'off'}
      {...rest}
    />
  );
};

export default Slider;
