//
import React from 'react';
import cx from 'classnames';

import ProgressBarStep from './ProgressBarStep';

const ProgressBar = ({ steps, className, currentIndex }) => (
  <div className={cx('progress-bar-v2', className)}>
    <div className="steps">
      {steps.map((step, index) => (
        <ProgressBarStep
          key={index}
          index={index}
          stepCount={steps.length}
          isDone={currentIndex >= index}
          isCurrentIndex={currentIndex === index}
          {...step}
        />
      ))}
    </div>
    <div className="absolute-lines">
      {steps.slice(0, -1).map((step, index) => (
        <span
          className={cx('line', { done: currentIndex > index })}
          key={index}
        />
      ))}
    </div>
  </div>
);

export default ProgressBar;
