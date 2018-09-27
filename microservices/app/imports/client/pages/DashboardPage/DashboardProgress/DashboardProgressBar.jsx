import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { STEP_ORDER } from 'core/api/constants';
import DashboardProgressBarStep from './DashboardProgressBarStep';

const DashboardProgressBar = ({ currentStep }) => (
  <div className="dashboard-progress-bar">
    <div className="steps">
      {STEP_ORDER.map((step, index) => (
        <DashboardProgressBarStep
          isDone={STEP_ORDER.indexOf(currentStep) >= index}
          step={step}
          key={step}
          id={step}
          nb={index + 1}
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

DashboardProgressBar.propTypes = {
  currentStep: PropTypes.string.isRequired,
};

export default DashboardProgressBar;
