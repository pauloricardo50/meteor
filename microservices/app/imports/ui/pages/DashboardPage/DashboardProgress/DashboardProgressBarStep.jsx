import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { T } from 'core/components/Translation';

const DashboardProgressBarStep = ({
  step: { nb, title },
  isCurrentStep,
  isDone,
}) => (
  <div key={nb} className="dashboard-progress-bar-step">
    <span className={classnames({ step: true, done: isDone })}>{nb}</span>
    {title || <T id={`steps.${nb}.title`} />}
  </div>
);

DashboardProgressBarStep.propTypes = {
  step: PropTypes.object.isRequired,
  isCurrentStep: PropTypes.bool.isRequired,
  isDone: PropTypes.bool.isRequired,
};

export default DashboardProgressBarStep;
