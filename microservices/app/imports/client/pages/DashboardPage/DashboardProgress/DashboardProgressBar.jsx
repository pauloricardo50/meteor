import React from 'react';
import PropTypes from 'prop-types';

import DashboardProgressBarStep from './DashboardProgressBarStep';

const DashboardProgressBar = ({ steps, currentStep }) => (
  <div className="dashboard-progress-bar">
    <div className="steps">
      {steps.map((step, index) => (
        <DashboardProgressBarStep
          isDone={currentStep > index}
          step={step}
          key={step.id}
          id={step.id}
          nb={index + 1}
        />
      ))}
    </div>
    {/* <div className="absolute-lines">
      {steps
        .slice(0, -1)
        .map((_, index) => <span className="line" key={index} />)}
      </div> */}
  </div>
);

DashboardProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
};

export default DashboardProgressBar;
