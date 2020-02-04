//      
import React from 'react';
import cx from 'classnames';

import useMedia from '../../hooks/useMedia';
import Tooltip from '../Material/Tooltip';

                               

const ProgressBarStep = ({
  isDone,
  label,
  index,
  tooltip,
  stepCount,
  isCurrentIndex,
}                      ) => {
  const isSmallMobile = useMedia({ maxWidth: 400 });

  const step = (
    <div
      className="progress-bar-v2-step"
      style={{ flexBasis: `${100 / stepCount}%` }}
    >
      <span className={cx('step', { done: isDone })}>{index + 1}</span>
      {(!isSmallMobile || isCurrentIndex) && (
        <span className="step-name">{label}</span>
      )}
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} enterTouchDelay={0}>
        {step}
      </Tooltip>
    );
  }

  return step;
};

export default ProgressBarStep;
