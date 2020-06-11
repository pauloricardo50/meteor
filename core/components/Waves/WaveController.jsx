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

    this.isSupported =
      global.SVGPathElement &&
      SVGPathElement.prototype.getPathData &&
      SVGPathElement.prototype.setPathData;

    this.state = { offset: this.props.initialOffset };

    this.offsetIncrement = this.props.speed / FRAMERATE;
    this.squareRoots = {};
  }

  componentDidMount = () => {
    if (this.isSupported) {
      requestAnimationFrame(this.animate);
    }
  };

  componentDidUpdate = ({ width }) => {
    if (width !== this.props.width) {
      // Reset square roots as they will be false
      this.squareRoots = {};
      if (ANIMATE) {
        requestAnimationFrame(this.animate);
      } else {
        this.createGraph(this.path);
      }
    }
  };

  setPathRef = node => {
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

  createGraph = wave => {
    const { width, height } = this.props;

    const data = [{ type: 'M', values: [0, 0] }];

    for (let x = 0; x < width; x += 1) {
      data.push({
        type: 'L',
        values: [
          x,
          height - this.pathFunction(this.props, this.state.offset, x),
        ],
      });
    }
    data.push({ type: 'L', values: [width, 0] });
    data.push({ type: 'Z' });
    wave.setPathData(data);
  };

  pathFunction = (props, offset, x) => {
    // Make sure we're using the same props for the entire render loop
    const { frequency, amplitude, noSlope } = props;
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
    if (!this.isSupported) {
      return null;
    }

    return <Wave setPathRef={this.setPathRef} {...this.props} />;
  }
}

WaveController.propTypes = {
  amplitude: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  height: PropTypes.number,
  initialOffset: PropTypes.number.isRequired,
  noSlope: PropTypes.bool,
  speed: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

WaveController.defaultProps = {
  noSlope: false,
  height: HEIGHT,
};
