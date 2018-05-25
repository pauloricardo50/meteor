import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

import Widget1SingleInputContainer from './Widget1SingleInputContainer';
import Widget1SingleInputInput from './Widget1SingleInputInput';
import Widget1SingleInputSlider from './Widget1SingleInputSlider';

const Widget1SingleInput = ({
  value,
  auto,
  name,
  setValue,
  setInputValue,
  unsetValue,
  setAuto,
  sliderMax,
  increaseSliderMax,
}) => (
  <div className="widget1-single-input">
    <div className="box">
      <h4>
        <label htmlFor={name}>
          <T id={`Widget1SingleInput.${name}`} />
        </label>
      </h4>
      <div className="box-content">
        <Widget1SingleInputInput
          value={value}
          setInputValue={setInputValue}
          auto={auto}
          setAuto={setAuto}
          unsetValue={unsetValue}
          name={name}
        />
        <Widget1SingleInputSlider
          value={value}
          setValue={setValue}
          sliderMax={sliderMax}
          increaseSliderMax={increaseSliderMax}
        />
      </div>
    </div>
  </div>
);

Widget1SingleInput.propTypes = {
  value: PropTypes.number,
  auto: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setInputValue: PropTypes.func.isRequired,
  unsetValue: PropTypes.func.isRequired,
  sliderMax: PropTypes.number.isRequired,
  increaseSliderMax: PropTypes.func.isRequired,
  setAuto: PropTypes.func.isRequired,
};

Widget1SingleInput.defaultProps = {
  value: undefined,
};

export default Widget1SingleInputContainer(Widget1SingleInput);
