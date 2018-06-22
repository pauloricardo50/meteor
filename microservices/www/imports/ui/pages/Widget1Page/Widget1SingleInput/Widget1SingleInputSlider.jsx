import React from 'react';
import PropTypes from 'prop-types';

import Slider from 'core/components/Material/Slider';
import T from 'core/components/Translation';
import IconButton from 'core/components/IconButton';

// Avoid weird slider bug, by first checking if value exists
// https://github.com/react-component/slider/issues/387
const getSliderValue = (value, sliderMax) => {
  if (value) {
    if (value >= sliderMax) {
      return sliderMax;
    }
    return value;
  }
  return 0;
};

const INCREASE_SLIDER_LIMIT = 0.9;

const showIncreaseButton = (value, sliderMax, allowExtremeLoan) =>
  sliderMax > 0 &&
  value >= INCREASE_SLIDER_LIMIT * sliderMax &&
  !allowExtremeLoan;

const Widget1SingleInputSlider = ({
  value,
  setValue,
  sliderMax,
  increaseSliderMax,
  isLoanValue,
  allowExtremeLoan,
}) => (
  <div className="widget1-slider">
    <Slider
      min={0}
      max={sliderMax}
      step={5000}
      // Do this to prevent an onChange event when typing in a value larger
      // than sliderMax, which sets the value back to sliderMax
      value={getSliderValue(value, sliderMax)}
      onChange={setValue}
      className="slider"
      tabIndex={-1}
    />
    {showIncreaseButton(value, sliderMax, allowExtremeLoan) ? (
      <IconButton
        type="add"
        tooltip={
          <T
            id={`Widget1SingleInputSlider.${
              isLoanValue ? 'buttonTooltipLoan' : 'buttonTooltip'
            }`}
          />
        }
        onClick={increaseSliderMax}
        tabIndex={-1}
      />
    ) :
      <div className="button-placeholder" />
    }
  </div>
);

Widget1SingleInputSlider.propTypes = {
  value: PropTypes.number,
  setValue: PropTypes.func.isRequired,
  sliderMax: PropTypes.number.isRequired,
  increaseSliderMax: PropTypes.func.isRequired,
  isLoanValue: PropTypes.bool.isRequired,
  allowExtremeLoan: PropTypes.bool,
};

Widget1SingleInputSlider.defaultProps = {
  value: undefined,
  allowExtremeLoan: undefined,
};

export default Widget1SingleInputSlider;
