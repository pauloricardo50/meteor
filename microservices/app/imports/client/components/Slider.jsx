import React from 'react';
import PropTypes from 'prop-types';

import MuiSlider from 'core/components/Slider';

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
    top: 16,
    left: 8,
  },
  labelMax: {
    position: 'absolute',
    top: 16,
    right: 0,
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
  value,
  style,
}) => {
  if (value > max) {
    onChange(id, max);
  } else if (value < min) {
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
          onChange={newValue => onChange(id, newValue)}
          value={value}
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
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  labelMax: PropTypes.string.isRequired,
  labelMin: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  sliderStyle: PropTypes.objectOf(PropTypes.any),
  step: PropTypes.number.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  value: PropTypes.number.isRequired,
};

Slider.defaultProps = {
  style: {},
  sliderStyle: {},
};

export default Slider;
