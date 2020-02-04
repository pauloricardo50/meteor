//      
import React, { useEffect, useRef } from 'react';

import useDebouncedInput from '../../hooks/useDebouncedInput';
import MuiSlider from '../Material/Slider';
import Tooltip from '../Material/Tooltip';

                      

const ValueLabelComponent = props => {
  const { children, value, open, valueLabelDisplay } = props;

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
      title={value}
      open={open}
      placement="top"
      PopperProps={{ popperRef }}
      enterTouchDelay={0}
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
  debounce,
  ...rest
}             ) => {
  const [debouncedValue, debouncedOnChange] = useDebouncedInput({
    value,
    onChange,
    debounce,
  });
  // const [fastValue, setFastValue] = useState(value);

  // // Only send the slider value to its parent after the slider has been
  // // untouched for 300ms. This avoids performance issues if the slider value
  // // is passed through other components that are expensive to update
  // useDebounce(() => debounce && onChange(fastValue), 300, [fastValue]);

  // const handleChange = (event, newValue) => {
  //   setFastValue(newValue);
  // };

  return (
    <MuiSlider
      min={min}
      max={max}
      defaultValue={defaultValue}
      value={debouncedValue}
      onChange={(event, v) => debouncedOnChange(v)}
      valueLabelFormat={valueLabelFormat}
      ValueLabelComponent={valueLabelFormat ? ValueLabelComponent : undefined}
      valueLabelDisplay={valueLabelFormat ? 'auto' : 'off'}
      {...rest}
    />
  );
};

export default Slider;
