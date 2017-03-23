import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import classNames from 'classnames';

import Start1Text from './Start1Text.jsx';
import Start1Slider from './Start1Slider.jsx';

export default class StartLine extends Component {
  shouldComponentUpdate(nextProps) {
    return true;
  }

  render() {
    return (
      <Motion
        defaultStyle={{ x: 0 }}
        style={{ x: spring(this.props.value, presets.gentle) }}
      >
        {value => (
          <article
            className={classNames({
              'oscar-line': true,
              property: this.props.name === 'property',
            })}
          >
            <label htmlFor={this.props.name}>{this.props.label}</label>
            <Start1Text {...this.props} motionValue={value.x} />
            <Start1Slider {...this.props} motionValue={value.x} />
          </article>
        )}
      </Motion>
    );
  }
}

StartLine.propTypes = {
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.objectOf(PropTypes.any).isRequired,
};
