// @flow
import React from 'react';
import cx from 'classnames';

import Tooltip from '../Material/Tooltip';

type ProgressCircleProps = {
  percent: Number,
  options: Object,
};

const ProgressCircle = ({ percent, options = {} }: ProgressCircleProps) => {
  const { squareSize = 50, strokeWidth = 10 } = options;
  const radius = (squareSize - strokeWidth) / 2;
  const viewBox = `0 0 ${squareSize} ${squareSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray * (1 - percent);

  return (
    <Tooltip title={`${Math.round(percent * 100)}%`} enterTouchDelay={0}>
      <span style={{ height: squareSize, width: squareSize }}>
        <svg
          width={squareSize}
          height={squareSize}
          viewBox={viewBox}
          className="progress-circle"
        >
          <circle
            className="progress-circle-background"
            cx={squareSize / 2}
            cy={squareSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
          />
          <circle
            className={cx('progress-circle-progress', {
              complete: percent === 1,
            })}
            cx={squareSize / 2}
            cy={squareSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            transform={`rotate(-90 ${squareSize / 2} ${squareSize / 2})`}
            style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
          />
        </svg>
      </span>
    </Tooltip>
  );
};

export default ProgressCircle;
