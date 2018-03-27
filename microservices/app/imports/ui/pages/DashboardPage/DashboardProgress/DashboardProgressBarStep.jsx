import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { T } from 'core/components/Translation';

const DashboardProgressBarStep = ({ step: { nb }, isCurrentStep, isDone }) => (
  <div key={nb} className="dashboard-progress-bar-step">
    <span className={classnames({ step: true, done: isDone })}>{nb}</span>
    <T id={`steps.${nb}.title`} />
  </div>
);

DashboardProgressBarStep.propTypes = {
  step: PropTypes.object.isRequired,
  isCurrentStep: PropTypes.number.isRequired,
  isDone: PropTypes.number.isRequired,
};

export default DashboardProgressBarStep;
