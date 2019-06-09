import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { STEP_ORDER } from 'core/api/constants';
import useMedia from 'core/hooks/useMedia';
import DashboardProgressBarStep from './DashboardProgressBarStep';

const DashboardProgressBar = ({ currentStep, variant }) => {
  const isSmallMobile = useMedia({ maxWidth: 400 });

  return (
    <div
      className={cx('dashboard-progress-bar', { light: variant === 'light' })}
    >
      <div className="steps">
        {STEP_ORDER.map((step, index) => (
          <DashboardProgressBarStep
            isDone={STEP_ORDER.indexOf(currentStep) >= index}
            step={step}
            key={step}
            id={step}
            nb={index + 1}
            displayLabel={
              !isSmallMobile || STEP_ORDER.indexOf(currentStep) === index
            }
          />
        ))}
      </div>
      <div className="absolute-lines">
        {STEP_ORDER.slice(0, -1).map((_, index) => (
          <span
            className={cx('line', {
              done: STEP_ORDER.indexOf(currentStep) > index,
            })}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

DashboardProgressBar.propTypes = {
  currentStep: PropTypes.string.isRequired,
};

export default DashboardProgressBar;
