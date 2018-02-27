import React, { Component } from 'react';

import WaveController from './WaveController';

const getValueInRange = (min, max) => Math.random() * (max - min) + min;

const waves = [
  {
    color1: 'rgb(29,88,245)',
    color2: 'rgba(0, 60, 150, 0.7)',
    gradient: true,
  },
  // { color: "rgba(0, 85,255, 0.9)" },
  // { color: "rgba(0, 85,255, 0.4)" },
  { color: 'rgba(0, 85,255, 0.2)' },
  { color: 'rgba(0, 85,255, 0.1)' },
].map(wave => ({
  ...wave,
  initialOffset: getValueInRange(1, 10),
  frequency: getValueInRange(0.1, 0.7),
  amplitude: getValueInRange(0.02, 0.05),
  speed: getValueInRange(0.1, 0.5),
}));

if (!global.window || typeof global.window !== 'object') {
  global.window = {
    innerHeight: 300,
    innerWidth: 400,
  };
}

class Waves extends Component {
  constructor(props) {
    super(props);

    this.state = {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };

  render() {
    const { windowWidth } = this.state;

    return (
      <div className="waves">
        <div className="waves-wrapper">
          {waves.map((wave, index) => (
            <WaveController {...wave} key={index} width={windowWidth * 1.2} />
          ))}
        </div>
      </div>
    );
  }
}

export default Waves;
