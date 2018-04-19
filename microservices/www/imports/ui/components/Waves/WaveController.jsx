import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Wave from './Wave';

// Inspired by this:
// https://codepen.io/anon/pen/PQxYRy

const ANIMATE = false;
const FRAMERATE = 60;
const WAVE_SLOPE = 0.25;
const HEIGHT = 800;

export default class WaveController extends Component {
  constructor(props) {
    super(props);

    this.state = { offset: this.props.initialOffset };

    this.offsetIncrement = this.props.speed / FRAMERATE;
    this.squareRoots = {};
  }

  componentDidMount = () => {
    requestAnimationFrame(this.animate);
  };

  componentDidUpdate = ({ width }) => {
    if (width !== this.props.width) {
      requestAnimationFrame(this.animate);
    }
  };

  setPathRef = (node) => {
    this.path = node;
  };

  animate = () => {
    this.setState(
      ({ offset }) => ({ offset: offset + this.offsetIncrement }),
      () => {
        this.createGraph(this.path);
        if (ANIMATE) {
          requestAnimationFrame(this.animate);
        }
      },
    );
  };

  createGraph = (wave) => {
    const { width } = this.props;

    const data = [{ type: 'M', values: [0, 0] }];

    for (let x = 0; x < width; x += 1) {
      data.push({
        type: 'L',
        values: [x, HEIGHT - this.pathFunction(this.state.offset, x)],
      });
    }
    data.push({ type: 'L', values: [width, 0] });
    data.push({ type: 'Z' });
    wave.setPathData(data);
  };

  pathFunction = (offset, x) => {
    const { frequency, amplitude, noSlope } = this.props;
    if (!this.squareRoots[x]) {
      // Cache square roots calculation as it's always the same
      this.squareRoots[x] = Math.sqrt(x * frequency);
    }
    return (
      (Math.sin(this.squareRoots[x] - offset) * amplitude +
        (noSlope ? 0 : WAVE_SLOPE)) *
      x
    );
  };

  render() {
    return (
      <Wave height={HEIGHT} setPathRef={this.setPathRef} {...this.props} />
    );
  }
}

WaveController.propTypes = {
  initialOffset: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  amplitude: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  noSlope: PropTypes.bool,
};

WaveController.defaultProps = {
  noSlope: false,
};
