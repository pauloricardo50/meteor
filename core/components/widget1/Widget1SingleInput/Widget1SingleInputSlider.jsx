import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '../../IconButton';
import Slider from '../../Slider';
import T from '../../Translation';

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
      debounce={false}
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
        size="small"
      />
    ) : (
      <div className="button-placeholder" />
    )}
  </div>
);

Widget1SingleInputSlider.propTypes = {
  allowExtremeLoan: PropTypes.bool,
  increaseSliderMax: PropTypes.func.isRequired,
  isLoanValue: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  sliderMax: PropTypes.number.isRequired,
  value: PropTypes.number,
};

Widget1SingleInputSlider.defaultProps = {
  value: undefined,
  allowExtremeLoan: undefined,
};

export default Widget1SingleInputSlider;
