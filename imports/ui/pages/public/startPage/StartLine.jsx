import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import classNames from 'classnames';

import Start1Text from './Start1Text.jsx';
import Start1Slider from './Start1Slider.jsx';

// Use a class to allow input focusing with ref using this.input
const StartLine = props => (
  <Motion
    defaultStyle={{ x: 0 }}
    style={{ x: spring(props.value, presets.gentle) }}
  >
    {value => (
      <article
        className={classNames({
          'oscar-line': true,
          property: props.name === 'property',
        })}
      >
        <label htmlFor={props.name}>{props.label}</label>
        <Start1Text {...props} motionValue={value.x} />
        <Start1Slider {...props} motionValue={value.x} />
      </article>
    )}
  </Motion>
);

StartLine.propTypes = {
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StartLine;
