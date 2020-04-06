import React from 'react';
import PropTypes from 'prop-types';

import T from '../../Translation';
import Widget1SingleInputContainer from './Widget1SingleInputContainer';
import Widget1SingleInputInput from './Widget1SingleInputInput';
import Widget1SingleInputSlider from './Widget1SingleInputSlider';

const Widget1SingleInput = ({
  value,
  auto,
  name,
  labelName = name,
  setValue,
  setInputValue,
  unsetValue,
  setAuto,
  sliderMax,
  increaseSliderMax,
  isLoanValue,
  allowExtremeLoan,
  tabIndex,
}) => (
  <div className="widget1-single-input">
    <div className="widget1-single-input-box">
      <label htmlFor={name}>
        <T id={`Widget1SingleInput.${labelName}`} />
      </label>
      <div className="widget1-single-input-box-content">
        <Widget1SingleInputInput
          value={value}
          setInputValue={setInputValue}
          auto={auto}
          setAuto={setAuto}
          unsetValue={unsetValue}
          name={name}
          tabIndex={tabIndex}
        />
        <Widget1SingleInputSlider
          value={value}
          setValue={setValue}
          sliderMax={sliderMax}
          increaseSliderMax={increaseSliderMax}
          isLoanValue={isLoanValue}
          allowExtremeLoan={allowExtremeLoan}
        />
      </div>
    </div>
  </div>
);

Widget1SingleInput.propTypes = {
  allowExtremeLoan: PropTypes.bool,
  auto: PropTypes.bool.isRequired,
  increaseSliderMax: PropTypes.func.isRequired,
  isLoanValue: PropTypes.bool.isRequired,
  labelName: PropTypes.string,
  name: PropTypes.string.isRequired,
  setAuto: PropTypes.func.isRequired,
  setInputValue: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  sliderMax: PropTypes.number.isRequired,
  tabIndex: PropTypes.number,
  unsetValue: PropTypes.func.isRequired,
  value: PropTypes.number,
};

Widget1SingleInput.defaultProps = {
  value: undefined,
  allowExtremeLoan: undefined,
  labelName: undefined,
  tabIndex: undefined,
};

export default Widget1SingleInputContainer(Widget1SingleInput);
