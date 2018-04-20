import React from 'react';
import PropTypes from 'prop-types';

import Slider from 'core/components/Material/Slider';

import IconButton from 'core/components/IconButton';

const Widget1SingleInputSlider = ({
  value,
  setValue,
  sliderMax,
  increaseSliderMax,
}) => (
  <div className="widget1-slider">
    <Slider
      min={0}
      max={sliderMax}
      step={1000}
      // Do this to prevent an onChange event when typing in a value larger
      // than sliderMax, which sets the value back to sliderMax
      value={value >= sliderMax ? sliderMax : value}
      onChange={setValue}
      className="slider"
    />
    {value >= sliderMax ? (
      <IconButton
        type="add"
        tooltip="Agrandir le slider"
        onClick={increaseSliderMax}
      />
    ) : (
      <div className="button-placeholder" />
    )}
  </div>
);

Widget1SingleInputSlider.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func.isRequired,
  sliderMax: PropTypes.number.isRequired,
  increaseSliderMax: PropTypes.func.isRequired,
};

Widget1SingleInputSlider.defaultProps = {
  value: undefined,
};

export default Widget1SingleInputSlider;
