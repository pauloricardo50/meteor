import PropTypes from 'prop-types';
import React from 'react';

import Slider from 'material-ui/Slider';

const StartSlider = props => {
  const val = props.value || props.formState[props.id];
  return (
    <span style={{ display: 'block', position: 'relative' }}>
      <Slider
        min={props.sliderMin}
        max={props.sliderMax}
        step={props.step || Math.max(Math.round((props.sliderMax - props.sliderMin) / 100), 1)}
        name={props.id}
        value={
          Math.min(Math.max(val, props.sliderMin), props.sliderMax) ||
            props.initialValue ||
            props.sliderMin
        }
        onChange={(e, v) => props.setFormState(props.id, Math.round(v))}
        onDragStart={() => {
          props.setActiveLine(props.id);
          if (props.onDragStart) {
            props.onDragStart();
          }
        }}
        sliderStyle={{ ...props.style }}
        style={{ padding: '0 40px' }}
      />
      {props.sliderLabels &&
        <div className="slider-labels">
          <h6 className="secondary fixed-size left">
            {props.sliderLabels[0]}
          </h6>
          <h6 className="secondary fixed-size right">
            {props.sliderLabels[1]}
          </h6>
        </div>}
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
