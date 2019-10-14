// @flow
import React, { useState, useEffect, useRef } from 'react';
import {
  Slider as MuiSlider,
  Tooltip,
} from '@material-ui/core';
import { useDebounce } from 'react-use';

type RangeProps = {};

const formatTooltip = (props) => {
  const { children, value, open } = props;

  const popperRef = useRef(null);
  useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      title={value}
      open={open}
      placement="top"
      PopperProps={{
        popperRef,
      }}
    >
      {children}
    </Tooltip>
  );
}

const Range = ({
  min = 0,
  max,
  defaultValue = [0],
  value,
  onChange,
  tipFormatter = x => x,
  debounce = true,
  ...rest
}: RangeProps) => {
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
      onChange={debounce ? handleChange : (event, value) => onChange(value)}
      valueLabelFormat={tipFormatter}
      ValueLabelComponent={formatTooltip}
      {...rest}
    />
  );
};

export default Range;
