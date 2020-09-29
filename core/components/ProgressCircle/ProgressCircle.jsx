import React, { Component } from 'react';
import cx from 'classnames';

import Tooltip from '../Material/Tooltip';

class ProgressCircle extends Component {
  constructor(props) {
    super(props);
    const { percent, options = {}, ratio } = props;
    const {
      squareSize = 50,
      strokeWidth = 10,
      animated = false,
      withLabel = false,
      withTooltip = true,
      withRatio = false,
      tooltipPrefix = '',
      style = {},
    } = options;
    this.animated = animated;
    this.withLabel = withLabel;
    this.withTooltip = withTooltip;
    this.targetPercent = percent;
    this.squareSize = squareSize;
    this.strokeWidth = strokeWidth;
    this.withRatio = withRatio;
    this.ratio = withRatio && ratio;
    this.tooltipPrefix = tooltipPrefix;
    this.radius = (squareSize - strokeWidth) / 2;
    this.viewBox = `0 0 ${squareSize} ${squareSize}`;
    this.dashArray = this.radius * Math.PI * 2;
    this.style = style;
  }

  UNSAFE_componentWillMount() {
    this.setState({ currentPercent: this.animated ? 0 : this.targetPercent });
  }

  componentDidMount() {
    if (this.targetPercent > 0 && this.animated) {
      this.interval = setInterval(() => {
        const { currentPercent } = this.state;
        if (this.targetPercent > currentPercent) {
          this.setState({
            currentPercent:
              currentPercent + (0.0001 * 250) / this.targetPercent,
          });
        } else {
          clearInterval(this.interval);
          this.setState({ currentPercent: this.targetPercent });
        }
      }, 1);
    }
  }

  getTooltipTitle() {
    if (this.ratio) {
      const { value, target } = this.ratio;
      return `${this.tooltipPrefix} ${value}/${target} (${Math.round(
        this.targetPercent * 100,
      )}%)`;
    }

    return `${this.tooltipPrefix} ${Math.round(this.targetPercent * 100)}%`;
  }

  render() {
    const { currentPercent } = this.state;
    const dashOffset = this.dashArray * (1 - currentPercent);

    return (
      <Tooltip
        title={this.getTooltipTitle()}
        enterTouchDelay={0}
        disableFocusListener={!this.withTooltip}
        disableHoverListener={!this.withTooltip}
        disableTouchListener={!this.withTooltip}
      >
        <span
          style={{
            height: this.squareSize,
            width: this.squareSize,
            ...this.style,
          }}
        >
          <svg
            width={this.squareSize}
            height={this.squareSize}
            viewBox={this.viewBox}
            className="progress-circle"
          >
            <circle
              className="progress-circle-background"
              cx={this.squareSize / 2}
              cy={this.squareSize / 2}
              r={this.radius}
              strokeWidth={`${this.strokeWidth}px`}
            />
            <circle
              className={cx('progress-circle-progress', {
                complete: currentPercent >= 1,
              })}
              cx={this.squareSize / 2}
              cy={this.squareSize / 2}
              r={this.radius}
              strokeWidth={`${this.strokeWidth}px`}
              transform={`rotate(-90 ${this.squareSize / 2} ${
                this.squareSize / 2
              })`}
              style={{
                strokeDasharray: this.dashArray,
                strokeDashoffset: dashOffset,
              }}
            />
            {this.withLabel && (
              <text
                className="progress-circle-text"
                x="50%"
                y="50%"
                dy=".3em"
                textAnchor="middle"
                style={{ fontSize: `${(0.3 * this.radius) / 10}em` }}
              >
                {`${Math.round(this.targetPercent * 100)}%`}
              </text>
            )}
          </svg>
        </span>
      </Tooltip>
    );
  }
}

export default ProgressCircle;
