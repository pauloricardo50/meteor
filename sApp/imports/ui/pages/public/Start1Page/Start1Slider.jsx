import PropTypes from 'prop-types';
import React from 'react';

import Slider from 'core/components/Material/Slider';
import Icon from '/imports/ui/components/general/Icon';

import { trackOncePerSession } from '/imports/js/helpers/analytics';

const Start1Slider = ({
  sliderMax,
  motionValue,
  auto,
  value,
  name,
  setStateValue,
  setSliderMax,
}) => (
  <div className="sliderDiv">
    <div>
      <Slider
        min={0}
        max={sliderMax}
        step={1000}
        value={
          motionValue < 5000
            ? 0
            : Math.min(Math.round(auto ? motionValue : value), sliderMax)
        }
        onChange={(v) => {
          trackOncePerSession(`Start1Slider - Used slider ${name}`);
          setStateValue(name, v);
        }}
        className="slider"
      />
      {value >= sliderMax && (
        <div className="sliderMaxButton animated fadeIn">
          <Icon
            type="add"
            onClick={setSliderMax}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
    </div>
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
