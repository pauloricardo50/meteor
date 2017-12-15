import PropTypes from 'prop-types';
import React from 'react';

import Slider from 'core/components/Material/Slider';

// Set the step according to the delta between max and min, and make
// sure that the delta can be divided without leftover by step
const getStep = (step, sliderMin, sliderMax) => {
  const delta = sliderMax - sliderMin;
  if (delta < 100 || delta % 100) {
    return 1;
  } else if (delta < 10000 || delta % 1000) {
    return 100;
  } else if (delta < 100000 || delta % 10000) {
    return 1000;
  }

  return 10000;
};

const StartSlider = ({
  value,
  id,
  formState,
  sliderMin,
  sliderMax,
  step,
  initialValue,
  setFormState,
  setActiveLine,
  onDragStart,
  sliderLabels,
}) => {
  const val = value || formState[id];
  return (
    <span className="start-slider">
      <Slider
        min={sliderMin}
        max={sliderMax}
        step={getStep(step, sliderMin, sliderMax)}
        name={id}
        value={
          Math.min(Math.max(val, sliderMin), sliderMax) ||
          initialValue ||
          sliderMin
        }
        onChange={v => setFormState(id, Math.round(v))}
        onBeforeChange={() => {
          setActiveLine(id);
          if (onDragStart) {
            onDragStart();
          }
        }}
      />
      {sliderLabels && (
        <div className="slider-labels">
          <h6 className="secondary fixed-size left">{sliderLabels[0]}</h6>
          <h6 className="secondary fixed-size right">{sliderLabels[1]}</h6>
        </div>
      )}
    </span>
  );
};

StartSlider.propTypes = {
  id: PropTypes.string.isRequired,
  setFormState: PropTypes.func.isRequired,
  formState: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  value: PropTypes.number,
  sliderMax: PropTypes.number.isRequired,
  sliderMin: PropTypes.number.isRequired,
  setActiveLine: PropTypes.func.isRequired,
  step: PropTypes.number,
  onDragStart: PropTypes.func,
  sliderLabels: PropTypes.arrayOf(PropTypes.any),
  initialValue: PropTypes.number,
};

StartSlider.defaultProps = {
  formState: {},
  style: {},
  money: false,
  value: 0,
  step: 0,
  onDragStart: undefined,
  sliderLabels: undefined,
  initialValue: 0,
};

export default StartSlider;
