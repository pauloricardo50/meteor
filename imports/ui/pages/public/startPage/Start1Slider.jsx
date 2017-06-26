import PropTypes from 'prop-types';
import React from 'react';

import Slider from 'material-ui/Slider';
import AddIcon from 'material-ui/svg-icons/content/add';

import { trackOncePerSession } from '/imports/js/helpers/analytics';

const Start1Slider = props =>
  <div className="sliderDiv">
    <Slider
      min={0}
      max={props.sliderMax}
      step={10000}
      value={
        props.motionValue < 5000
          ? 0
          : Math.min(Math.round(props.auto ? props.motionValue : props.value), props.sliderMax)
      }
      onChange={(e, v) => {
        trackOncePerSession(`Start1Slider - Used slider ${name}`);
        props.setStateValue(props.name, v);
      }}
      className="slider"
    />
    {props.value >= props.sliderMax &&
      <div className="sliderMaxButton animated fadeIn">
        <AddIcon onTouchTap={props.setSliderMax} style={{ cursor: 'pointer' }} />
      </div>}
  </div>;

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
