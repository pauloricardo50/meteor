import React from 'react';
import PropTypes from 'prop-types';

import DashboardProgressBarStep from './DashboardProgressBarStep';

const DashboardProgressBar = ({ steps, currentStep }) => (
  <div className="dashboard-progress-bar">
    <div className="steps">
      {steps.map((step, index) => (
        <DashboardProgressBarStep
          isDone={currentStep > step.nb}
          isCurrentStep={currentStep === step.nb}
          step={step}
          key={step.nb}
          label={step.title}
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

DashboardProgressBar.propTypes = {};

export default DashboardProgressBar;
