import React from 'react';
import PropTypes from 'prop-types';

import DashboardProgressBarStep from './DashboardProgressBarStep';

const DashboardProgressBar = ({ steps, currentStep }) => (
  <div className="dashboard-progress-bar">
    {steps.map(step => (
      <DashboardProgressBarStep
        isDone={currentStep > step.nb}
        isCurrentStep={currentStep === step.nb}
        step={step}
        key={step.nb}
      />
    ))}
    <div className="absolute-lines">
      {steps
        .slice(0, -1)
        .map((_, index) => <span className="line" key={index} />)}
    </div>
  </div>
);

DashboardProgressBar.propTypes = {};

export default DashboardProgressBar;
