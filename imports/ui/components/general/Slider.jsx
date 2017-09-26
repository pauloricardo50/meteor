import React from 'react';
import PropTypes from 'prop-types';

import MuiSlider from './Material/Slider';

const styles = {
  div: {
    marginBottom: '1.5em',
  },
  slider: {
    position: 'relative',
    marginTop: 0,
    marginBottom: 0,
  },
  labelMin: {
    position: 'absolute',
    top: 24,
    left: 8,
  },
  labelMax: {
    position: 'absolute',
    top: 24,
    right: 8,
  },
};

const Slider = ({
  label,
  id,
  labelMin,
  labelMax,
  min,
  max,
  step,
  onChange,
  currentValue,
  style,
  sliderStyle,
}) => {
  if (currentValue > max) {
    onChange(id, max);
  } else if (currentValue < min) {
    onChange(id, min);
  }

  return (
    <div className="flex-col" style={{ ...style, ...styles.div }}>
      <label htmlFor={id}>{label}</label>
      <div style={{ position: 'relative', padding: '0 16px' }}>
        <MuiSlider
          id={id}
          min={min}
          max={max}
          step={step}
          onChange={(event, newValue) => onChange(id, newValue)}
          value={currentValue}
          // sliderStyle={{ ...sliderStyle, ...styles.slider }}
        />
        <p className="secondary" style={styles.labelMin}>
          {labelMin}
        </p>
        <p className="secondary" style={styles.labelMax}>
          {labelMax}
        </p>
      </div>
    </div>
  );
};

Slider.propTypes = {
  label: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  labelMin: PropTypes.string.isRequired,
  labelMax: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  currentValue: PropTypes.number.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  sliderStyle: PropTypes.objectOf(PropTypes.any),
};

Slider.defaultProps = {
  style: {},
  sliderStyle: {},
};

export default Slider;
