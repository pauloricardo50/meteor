import React, { PropTypes } from 'react';

import Slider from 'material-ui/Slider';
import AddIcon from 'material-ui/svg-icons/content/add';

const Start1Slider = props => (
  <div>
    <Slider
      value={
        props.motionValue < 5000
          ? 0
          : Math.min(
              Math.round(props.auto ? props.motionValue : props.value) /
                props.sliderMax,
              1,
            )
      }
      onChange={(e, v) => props.setStateValue(props.name, v * props.sliderMax)}
      step={10000 / props.sliderMax}
      className="slider"
    />
    {props.value >= props.sliderMax &&
      <div className="sliderMaxButton animated fadeIn">
        <AddIcon
          onTouchTap={props.setSliderMax}
          style={{ cursor: 'pointer' }}
        />
      </div>}
  </div>
);

Start1Slider.propTypes = {
  value: PropTypes.number.isRequired,
  motionValue: PropTypes.number.isRequired,
  setStateValue: PropTypes.func.isRequired,
  setSliderMax: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  sliderMax: PropTypes.number.isRequired,
  auto: PropTypes.bool.isRequired,
};

export default Start1Slider;
