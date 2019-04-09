import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import colors from 'core/config/colors';

import WaveController from './WaveController';

const getValueInRange = (min, max) => Math.random() * (max - min) + min;

if (!global.window || typeof global.window !== 'object') {
  global.window = {
    innerHeight: 300,
    innerWidth: 400,
  };
}

const getPrimaryWithOpacity = opacity =>
  `rgba(${colors.primaryArray.join(',')}, ${opacity})`;

class Waves extends Component {
  constructor(props) {
    super(props);

    this.state = { windowWidth: window.innerWidth };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getWaves = transparent =>
    [
      { color: getPrimaryWithOpacity(0.2) },
      { color: getPrimaryWithOpacity(0.1) },
      {
        gradient: true,
        color1: getPrimaryWithOpacity(1),
        color2: transparent
          ? getPrimaryWithOpacity(0.6)
          : getPrimaryWithOpacity(1),
      },
    ].map(wave => ({
      ...wave,
      initialOffset: getValueInRange(1, 10),
      frequency: getValueInRange(0.1, 0.7),
      amplitude: getValueInRange(0.02, 0.05),
      speed: getValueInRange(0.1, 0.5),
    }));

  handleResize = debounce(() => {
    // Only set state on window width change, otherwise it's too costly
    if (window.innerWidth !== this.state.windowWidth) {
      this.setState({ windowWidth: window.innerWidth });
    }
  }, 500);

  render() {
    const { windowWidth } = this.state;
    const { transparent } = this.props;

    const waves = this.getWaves(transparent);

    return (
      <div className="waves">
        <div className="waves-wrapper">
          {waves.map((wave, index) => (
            <WaveController
              {...wave}
              key={index}
              width={windowWidth * 1.2}
              {...this.props}
            />
          ))}
        </div>
      </div>
    );
  }
}

Waves.propTypes = {
  transparent: PropTypes.bool,
};

Waves.defaultProps = {
  transparent: true,
};

export default Waves;
