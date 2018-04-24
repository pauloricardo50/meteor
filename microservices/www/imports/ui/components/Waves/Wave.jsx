import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Wave extends Component {
  render() {
    const { setPathRef, color, gradient, color1, color2, height } = this.props;
    return (
      <div className="wave" style={{ height }}>
        <svg className="svg" width="100%" height="100%">
          {gradient && (
            <defs>
              <linearGradient
                id="linear"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
                spreadMethod="pad"
              >
                <stop offset="0%" stopColor={color1} />
                <stop offset="100%" stopColor={color2} />
              </linearGradient>
            </defs>
          )}
          <path
            fill={gradient ? 'url(#linear)' : color}
            d="M0,150"
            ref={setPathRef}
          />
        </svg>
      </div>
    );
  }
}

Wave.propTypes = {
  height: PropTypes.number.isRequired,
  setPathRef: PropTypes.func.isRequired,
  color: PropTypes.string,
  gradient: PropTypes.bool,
  color1: PropTypes.string,
  color2: PropTypes.string,
};

Wave.defaultProps = {
  color: undefined,
  gradient: false,
  color1: undefined,
  color2: undefined,
};

export default Wave;
