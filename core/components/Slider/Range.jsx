// @flow
import React, { useState } from 'react';
//import RCSlider from 'rc-slider';
import { Slider as MuiSlider } from '@material-ui/core';
import { useDebounce } from 'react-use';
import Tooltip from '@material-ui/core/Tooltip'

//const { createSliderWithTooltip } = RCSlider;
//const RangeSlider = createSliderWithTooltip(RCSlider.Range);

type RangeProps = {};

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
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
      allowCross={false}
      pushable
      ValueLabelComponent={ValueLabelComponent}
      tipFormatter={tipFormatter}
      {...rest}
    />
  );
};

export default Range;
